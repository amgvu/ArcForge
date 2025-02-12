import { useState, useEffect } from 'react';
import { Member, Nickname } from '@/types/types';
import { updateNickname, saveNicknames } from '@/lib/utilities';

export const useMemberManagement = (selectedServer: string, fetchedMembers: Member[]) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isApplyingAll, setIsApplyingAll] = useState(false);
  const [previousNicknames, setPreviousNicknames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fetchedMembers) {
      setMembers(fetchedMembers);
    }
  }, [fetchedMembers]);

  const handleNicknameChange = (index: number, nickname: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], nickname };
    setMembers(updatedMembers);
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
            await saveNicknames(selectedServer, [{
              userId: member.user_id,
              nickname: member.nickname,
              userTag: member.username
            }]);
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

  return {
    members,
    setMembers,
    isUpdating,
    isApplyingAll,
    handleNicknameChange,
    handleUpdateNickname,
    applyAllNicknames
  };
};