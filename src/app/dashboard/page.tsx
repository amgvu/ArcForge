"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { DSButton, DSMenu, DSUserList, DSCreateMenu } from "@/components";
import { useServers, useMembers } from "@/lib/hooks";
import { updateNickname, saveNicknames } from "@/lib/utilities";
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
            

  const handleUpdateNickname = async (userId: string, nickname: string, saveToDb: boolean = true) => {
    try {
      setIsUpdating(userId);
      
      await updateNickname(selectedServer, userId, nickname);

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
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-[#D7DADC] flex items-center justify-center bg-neutral-900 p-4 space-y-4">
      <div className={`max-w-[1320px] w-full space-y-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center font-[family-name:var(--font-geist-mono)] mb-2">
        <h1 className="text-2xl">Project Arcs</h1>
          <h3 className="font-semibold font-[family-name:var(--font-geist-sans)] py-6 text-md">This application
            is in an early stage of development. Features, functionality and user experience are subject to change.
            If you run into any bugs or issues, please shoot me a message on Discord @ amg00. Thanks!
          </h3>
        </div>
        <div className="space-y-2">
          <div className="rounded-md">
            <label className="block text-sm font-medium mb-1">My Servers</label>
            <DSMenu
              items={servers.map((server: { name: string }) => server.name)}
              placeholder='Select a server'
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
            <label className="block text-sm font-medium mb-1">My Arcs</label>
            <DSCreateMenu
              selectedServer={selectedServer}
              selectedArc={selectedArc}
              setSelectedArc={setSelectedArc}
              onCreateNewArc={handleCreateNewArc}
            />
          </div>

          <div className="flex justify-end mt-4 space-x-4">
          <DSButton
            onClick={applyAllNicknames}
            disabled={isApplyingAll || members.some((m: Member) => !m.nickname)}
          >
            {isApplyingAll ? 'Applying...' : 'Apply Arc'}
          </DSButton>
          <div className="">
            <DSButton
              onClick={handleSaveArc}
              disabled={isSavingArc || !selectedServer || !selectedArc || members.length === 0}
            >
              {isSavingArc ? 'Saving...' : 'Save Arc'}
            </DSButton>
          </div>
          <div className="justify-start">
            </div>
        </div>

          <div className="rounded-md">
            {(serversError || membersError) && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                {serversError || membersError}
              </div>
            )}
            <DSUserList
              selectedServer={selectedServer}
              members={members}
              isUpdating={isUpdating}
              onNicknameChange={handleNicknameChange}
              onApplyNickname={(userId: string, nickname: string) => handleUpdateNickname(userId, nickname, true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}