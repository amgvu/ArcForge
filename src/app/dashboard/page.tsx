"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { DSButton, DSMenu, DSUserList, DSCreateMenu, DSInput } from "@/components";
import { useServers, useMembers} from "@/lib/hooks";
import { updateNickname, saveNicknames } from "@/lib/utilities";
import { characterGen } from "@/lib/utilities/gemini/characters"
import { ArcNickname, Arc, Nickname, Member  } from "@/types/types";
import { createArc, saveArcNicknames, fetchArcNicknames, checkExistingArc, deleteArcNicknames } from "@/lib/utilities/api";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { servers, error: serversError } = useServers();

  const [selectedServer, setSelectedServer] = useState('');
  const [selectedArc, setSelectedArc] = useState<Arc | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isApplyingAll, setIsApplyingAll] = useState(false);
  const [isSavingArc, setIsSavingArc] = useState(false);
  const [selectedServerName, setSelectedServerName] = useState<string>('');
  const { members: fetchedMembers, error: membersError } = useMembers(selectedServer);
  const [members, setMembers] = useState<Member[]>([]);
  const [theme, setTheme] = useState<string>("");
  const [generatedThemes, setGeneratedThemes] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previousNicknames, setPreviousNicknames] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('discord');
    }
  }, [status]);

  useEffect(() => {
    if (fetchedMembers) {
      setMembers(fetchedMembers);
    }
  }, [fetchedMembers]);

  useEffect(() => {
    const loadArcNicknames = async () => {
      if (selectedArc) {
        try {
          const arcNicknames = await fetchArcNicknames(selectedArc.id);
  
          setMembers((currentMembers) =>
            currentMembers.map((member) => {
              const arcNickname = arcNicknames.find((an) => an.user_id === member.user_id);
              return arcNickname
                ? { ...member, nickname: arcNickname.nickname }
                : member;
            })
          );
        } catch (error) {
          console.error('Failed to fetch arc nicknames:', error);
        }
      }
    };
  
    loadArcNicknames();
  }, [selectedArc]);

  const handleGenerateCharacters = async () => {
    if (!fetchedMembers || fetchedMembers.length === 0) {
      alert("No members found in the server. Please select a valid server.");
      return;
    }
  
    if (!theme.trim()) {
      alert("Please enter a theme.");
      return;
    }
  
    setLoading(true);
    try {
      const numCharacters = fetchedMembers.length;
      const characters = await characterGen(theme, numCharacters);
      setGeneratedThemes(characters);
      console.log(generatedThemes)
      
      const generatedNames = characters.split(',').map(name => name.trim());
      
      setMembers(currentMembers => 
        currentMembers.map((member, index) => ({
          ...member,
          nickname: generatedNames[index] || member.nickname 
        }))
      );
  
    } catch (error) {
      console.error("Failed to generate themes:", error);
      alert("Failed to generate themes. Please try again.");
    } finally {
      setLoading(false);
    }
  };
            

  const handleUpdateNickname = async (userId: string, nickname: string, saveToDb: boolean = true) => {
    try {
      const fetchedMember = fetchedMembers.find((m) => m.user_id === userId);
      const previousNickname = previousNicknames[userId];
      
      if ((!fetchedMember || fetchedMember.nickname !== nickname) && 
          (!previousNickname || previousNickname !== nickname)) {
        setIsUpdating(userId);
        
        await updateNickname(selectedServer, userId, nickname);
        
        setPreviousNicknames(prev => ({
          ...prev,
          [userId]: nickname
        }));
  
        if (saveToDb) {
          const member = members.find((m: Member) => m.user_id === userId);
          if (member) {
            await saveNicknames(selectedServer, [
              {
                userId: member.user_id,
                nickname: member.nickname,
                userTag: member.username
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const applyAllNicknames = async () => {
    setIsApplyingAll(true);
    try {
      const nicknamesToSave: Nickname[] = members.map((member: Member) => ({
        userId: member.user_id,
        nickname: member.nickname,
        userTag: member.username,
      }));

      await saveNicknames(selectedServer, nicknamesToSave);

      const updatePromises = members.map((member: Member) =>
        handleUpdateNickname(member.user_id, member.nickname, false)
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error(error);
    } finally {
      setIsApplyingAll(false);
    }
  };

  const handleNicknameChange = (index: number, nickname: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], nickname };
    setMembers(updatedMembers);
  };

  const handleSaveArc = async () => {
    if (!selectedServer || !selectedArc || !selectedArc.arc_name) {
      alert('Please select a server, arc, and ensure members are loaded.');
      return;
    }
  
    setIsSavingArc(true);
  
    try {
      const existingArc = await checkExistingArc(selectedServer, selectedArc.arc_name);
  
      if (existingArc) {
        const confirmOverwrite = window.confirm(
          'An arc with this name already exists. Do you want to overwrite it with the new set of nicknames?'
        );
  
        if (!confirmOverwrite) {
          return;
        }
  
        await deleteArcNicknames(existingArc.id);
      }
  
      const arc = existingArc || (await createArc(selectedServer, selectedArc.arc_name));
  
      const newNicknames: ArcNickname[] = members.map((member) => {
        if (!member.userTag && !member.username) {
          throw new Error(`User tag and username are missing for user ${member.user_id}`);
        }
  
        return {
          arc_id: arc.id!,
          guild_id: selectedServer,
          user_id: member.user_id,
          nickname: member.nickname,
          userTag: member.userTag || member.username,
        };
      });
  
      await saveArcNicknames(newNicknames);
  
      alert('Arc saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save arc. Please try again.');
    } finally {
      setIsSavingArc(false);
    }
  };

  const handleCreateNewArc = async (newArcName: string) => {
    try {
      const newArc = await createArc(selectedServer, newArcName);

      setSelectedArc(newArc);
    } catch (error) {
      console.error('Failed to create new arc:', error);
      alert('Failed to create new arc. Please try again.');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Redirecting to sign-in...</div>;
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-[#D7DADC] bg-neutral-900">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content flex flex-col">

          <div className="p-4">
            <div className={`w-auto transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex justify-between items-center">
                <div className="text-center font-bold font-[family-name:var(--font-geist-sans)]">
                </div>
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                  Open Menu
                </label>
              </div>

              <div className="flex flex-col">
                <div className="text-4xl text-neutral-600 font-semibold text-center py-5">
                </div>
                <div className="justify-items-center">
                  {serversError || membersError ? (
                    <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                      {serversError || membersError}
                    </div>
                  ) : selectedServer ? (
                    <DSUserList
                      selectedServer={selectedServer}
                      members={members}
                      isUpdating={isUpdating}
                      onNicknameChange={handleNicknameChange}
                      onApplyNickname={(userId: string, nickname: string) => handleUpdateNickname(userId, nickname, true)}
                      isApplyingAll={isApplyingAll}
                      
                    />
                  ) : (
                    <div className="text-center font-semibold text-4xl text-neutral-500 py-5">
                      Select a server to view and manage members
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-side ml-60">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu bg-neutral-800 border-r border-neutral-700 min-h-full w-80 p-4">
            <div className="space-y-6 mt-3">
              <div className="rounded-md">
                <label className="block text-lg font-medium mb-3">My Servers</label>
                <DSMenu
                  items={servers.map((server: { name: string }) => server.name)}
                  placeholder="Select a server"
                  selectedItem={selectedServerName}
                  setSelectedItem={(value: string) => {
                    const selected = servers.find((server: { name: string; id: string }) => server.name === value);
                    if (selected) {
                      setSelectedServerName(selected.name);
                      setSelectedServer(selected.id);
                    } else {
                      setSelectedServerName('');
                      setSelectedServer('');
                    }
                  }}
                />
              </div>
              <div className="rounded-md">
                <label className="block text-lg font-medium mb-3">My Arcs</label>
                <DSCreateMenu
                  selectedServer={selectedServer}
                  selectedArc={selectedArc}
                  setSelectedArc={setSelectedArc}
                  onCreateNewArc={handleCreateNewArc}
                />
              </div>
              <div>
                <ul>
                <div className="flex justify-end space-x-4">
                    <DSButton
                      onClick={applyAllNicknames}
                      disabled={isApplyingAll || members.some((m: Member) => !m.nickname)}
                    >
                      {isApplyingAll ? 'Applying...' : 'Apply Arc'}
                    </DSButton>
                    <DSButton
                      onClick={handleSaveArc}
                      disabled={isSavingArc || !selectedServer || !selectedArc || members.length === 0}
                    >
                      {isSavingArc ? 'Saving...' : 'Save Arc'}
                    </DSButton>
                  </div>
                </ul>
              </div>

              <div className="border-t border-neutral-700 pt-4">
                <label className="inline-block text-lg font-medium">Arc Studio</label>
                  <h2 className="inline-block mx-2 font-light text-neutral-500">experimental</h2>
                  <h3 className="font-light mt-1 text-sm text-neutral-400">
                    Generate themes for arcs and apply them within seconds
                  </h3>

                  <div className="mt-4">

                <DSInput className="transition-all bg-neutral-800 border rounded-lg border-neutral-600"
                        placeholder="Enter a movie, show, game, etc"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                          />
                  <div className="flex justify-end space-x-4 mt-3">
                  <DSButton onClick={handleGenerateCharacters} disabled={loading}>Generate</DSButton>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
