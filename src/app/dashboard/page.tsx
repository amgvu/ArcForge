'use client'

import { useState, useEffect } from 'react'
import MenuComponent from '@/components/ui/Menu'
import ButtonComponent from '@/components/ui/Button'
import InputComponent from '@/components/ui/Input'

const servers = ['꒰ᵕ༚ᵕ꒱ ˖°', 'Ground Zero', '1112651880389169153']
const arcs = ['League of Legends Arc', 'Marvel Arc']

export default function Dashboard() {
  const [selectedServer, setSelectedServer] = useState('')
  const [selectedArc, setSelectedArc] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [members, setMembers] = useState<
  { user_id: string; username: string; nickname: string; tag: string }[]
>([]);
  const [isApplyingAll, setIsApplyingAll] = useState(false);

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const fetchMembers = async (guildId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/members/${guildId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
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
  
      const response = await fetch('http://localhost:3000/api/nickname', {
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
  
      console.log('Nickname updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating nickname:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const applyAllNicknames = async () => {
    setIsApplyingAll(true);
    setError('');
  
    try {
      const updatePromises = members.map((member) =>
        updateNickname(member.user_id, member.nickname)
      );
  
      await Promise.all(updatePromises);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to apply all nicknames');
      console.error('Error applying nicknames:', error);
    } finally {
      setIsApplyingAll(false);
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-[#D7DADC] flex items-center justify-center bg-[#0A0A0B] p-4">
      <div className={`max-w-4xl w-full space-y-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-2xl font-semibold mb-4">ArcForge</h1>

        <div className="rounded-lg bg-[#121214] shadow-md p-6">
          <label className="block text-sm font-medium mb-1">
            Select Server
          </label>
          <MenuComponent
            items={servers}
            selectedItem={selectedServer}
            setSelectedItem={setSelectedServer}
          />
        </div>

        <div className="rounded-lg bg-[#121214] shadow-md p-6">
          <label className="block text-sm font-medium mb-1">
            Select Arc
          </label>
          <MenuComponent
            items={arcs}
            selectedItem={selectedArc}
            setSelectedItem={setSelectedArc}
          />
        </div>

        <div className="rounded-lg bg-[#121214] shadow-md p-6">
  {error && (
    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
      {error}
    </div>
  )}
  <div className="flex flex-col items-center space-y-4">
    {members.map((member, index) => (
      <div key={member.user_id} className="flex items-center space-x-2 w-full">
        <div className="flex-1">
          <InputComponent
            value={member.nickname}
            onChange={(e) => {
              const updatedMembers = [...members];
              updatedMembers[index] = { ...updatedMembers[index], nickname: e.target.value };
              setMembers(updatedMembers);
            }}
            placeholder={`Nickname for ${member.username}`}
            className="w-full"
            disabled={isUpdating === member.user_id}
          />
          <div className="text-sm text-gray-400 mt-1">
            {member.username}#{member.tag}
          </div>
        </div>
        <ButtonComponent
          onClick={() => updateNickname(member.user_id, member.nickname)}
          disabled={isUpdating === member.user_id || !member.nickname}
        >
          {isUpdating === member.user_id ? 'Applying...' : 'Apply'}
        </ButtonComponent>
      </div>
    ))}
  </div>
</div>

        <div className="flex justify-end mt-4 space-x-4">
          <ButtonComponent 
            onClick={applyAllNicknames}
            disabled={isApplyingAll || members.some(m => !m.nickname)}
          >
            {isApplyingAll ? 'Applying...' : 'Apply Arc'}
          </ButtonComponent>
          <ButtonComponent>Save Arc</ButtonComponent>
        </div>
      </div>
    </div>
  )
}