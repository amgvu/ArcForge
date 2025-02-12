import { useState, useEffect } from 'react';
import { Member, Nickname, Arc } from '@/types/types';
import { useMembers } from '@/lib/hooks';
import { updateNickname, saveNicknames } from '@/lib/utilities';
import { fetchArcNicknames } from '@/lib/utilities/api';

export const useMemberManagement = (selectedServer: string, selectedArc: Arc | null) => {
  const { members: fetchedMembers, error: membersError } = useMembers(selectedServer);
  const [members, setMembers] = useState<Member[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isApplyingAll, setIsApplyingAll] = useState(false);
  const [previousNicknames, setPreviousNicknames] = useState<Record<string, string>>({});

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

  return {
    members,
    membersError,
    isUpdating,
    isApplyingAll,
    handleUpdateNickname,
    handleNicknameChange,
    applyAllNicknames
  };
};
