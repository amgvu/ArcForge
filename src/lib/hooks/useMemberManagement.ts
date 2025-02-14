import { useState, useEffect } from "react";
import { Member, Nickname } from "@/types/types";
import { updateNickname, saveNicknames } from "@/lib/utilities";

export const useMemberManagement = (
  selectedServer: string,
  fetchedMembers: Member[]
) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isApplyingAll, setIsApplyingAll] = useState(false);

  useEffect(() => {
    if (fetchedMembers) {
      setMembers(fetchedMembers);
    }
  }, [fetchedMembers]);

  const handleNicknameChange = (index: number, nickname: string) => {
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      const memberToUpdate = updatedMembers[index];
      if (memberToUpdate) {
        updatedMembers[index] = {
          ...memberToUpdate,
          nickname,
        };
      }
      return updatedMembers;
    });
  };

  const handleUpdateNickname = async (
    userId: string,
    nickname: string,
    saveToDb: boolean = true
  ) => {
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
              userTag: member.username,
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

  return {
    members,
    setMembers,
    isUpdating,
    isApplyingAll,
    handleNicknameChange,
    handleUpdateNickname,
    applyAllNicknames,
  };
};
