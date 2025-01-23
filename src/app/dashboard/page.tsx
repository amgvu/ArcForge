'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { DSButton, DSMenu, DSUserList } from '@/components';
import { Server } from '@/types/servers';

const arcs = ['League of Legends Arc', 'Marvel Arc'];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedArc, setSelectedArc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<
    { user_id: string; username: string; nickname: string; tag: string; avatar_url: string; discriminator: string; }[]
  >([]);
  const [isApplyingAll, setIsApplyingAll] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerName, setSelectedServerName] = useState<string>('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('discord');
    }
  }, [status]);

  const fetchSameServers = useCallback(async () => {
    if (session?.accessToken && session.user?.id) {
      try {
        const cachedServers = localStorage.getItem('cachedServers');
        if (cachedServers) {
          setServers(JSON.parse(cachedServers));
          return;
        }

        const response = await fetch('http://localhost:3000/api/servers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: session.accessToken,
            userId: session.user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch servers: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        setServers(data.map((server: Server) => ({
          name: server.name,
          id: server.id,
        })));

        localStorage.setItem('cachedServers', JSON.stringify(data));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch servers');
      }
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSameServers();
    }
  }, [status, fetchSameServers, session?.accessToken, session?.user?.id]);

  const fetchMembers = async (guildId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/members/${guildId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch members');
    }
  };

  useEffect(() => {
    if (selectedServer) {
      fetchMembers(selectedServer);
    }
  }, [selectedServer]);

  const updateNickname = async (userId: string, nickname: string) => {
    try {
      setIsUpdating(userId);
      setError(null);
  
      const response = await fetch('http://localhost:3000/api/changeNickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guild_id: selectedServer,
          user_id: userId,
          nickname,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403 && errorData.code === 50013) {
          throw new Error('Cannot change nickname of server owner or users with higher roles');
        }
        throw new Error(errorData.message || 'Failed to update nickname');
      }
  
      const member = members.find((m) => m.user_id === userId);
      if (member) {
        const saveResponse = await fetch('http://localhost:3000/api/save-nicknames', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guildId: selectedServer,
            nicknames: [
              {
                userId: member.user_id,
                nickname: member.nickname,
                userTag: member.tag,
              },
            ],
          }),
        });
  
        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || 'Failed to save nickname');
        }
  
        console.log('Nickname saved successfully:', member.nickname);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUpdating(null);
    }
  };

  const applyAllNicknames = async () => {
    setIsApplyingAll(true);
    setError('');
  
    try {
      const nicknamesToSave = members.map((member) => {
        const discriminator = member.discriminator === '0' ? '0000' : member.discriminator;
        const userTag = member.tag || `${member.username}#${discriminator}`;
        return {
          userId: member.user_id,
          nickname: member.nickname,
          userTag: userTag,
        };
      });
  
      console.log('Nicknames to save:', nicknamesToSave);
  
      const saveResponse = await fetch('http://localhost:3000/api/save-nicknames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guildId: selectedServer,
          nicknames: nicknamesToSave,
        }),
      });
  
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save nicknames');
      }
  
      console.log('All nicknames saved successfully:', nicknamesToSave);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to apply all nicknames');
    } finally {
      setIsApplyingAll(false);
    }
  };

  const handleNicknameChange = (index: number, nickname: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], nickname };
    setMembers(updatedMembers);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Redirecting to sign-in...</div>;
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-[#D7DADC] flex items-center justify-center bg-[#0A0A0B] p-4">
      <div className={`max-w-4xl w-full space-y-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-2xl font-semibold mb-4">ArcForge</h1>
        <div className="rounded-lg bg-zinc-900 space-y-5 shadow-md p-8">
          <div className="rounded-lg bg-[#121214] shadow-md p-6">
            <label className="block text-sm font-medium mb-1">Select Server</label>
            <DSMenu
              items={servers.map(server => server.name)}
              selectedItem={selectedServerName}
              setSelectedItem={(value) => {
                const selected = servers.find(server => server.name === value);
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

          <div className="rounded-lg bg-[#121214] shadow-md p-6">
            <label className="block text-sm font-medium mb-1">Select Arc</label>
            <DSMenu
              items={arcs}
              selectedItem={selectedArc}
              setSelectedItem={setSelectedArc}
            />
          </div>

          <div className="rounded-lg bg-[#121214] shadow-md p-6">
            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                {error}
              </div>
            )}
            <DSUserList
              members={members}
              isUpdating={isUpdating}
              onNicknameChange={handleNicknameChange}
              onApplyNickname={updateNickname}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <DSButton
            onClick={applyAllNicknames}
            disabled={isApplyingAll || members.some(m => !m.nickname)}
          >
            {isApplyingAll ? 'Applying...' : 'Apply Arc'}
          </DSButton>
          <DSButton>Save Arc</DSButton>
        </div>
      </div>
    </div>
  );
}