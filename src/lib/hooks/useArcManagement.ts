import { useState, useEffect } from "react";
import { Arc, ArcNickname, Member } from "@/types/types";
import {
  createArc,
  saveArcNicknames,
  checkExistingArc,
  deleteArcNicknames,
  fetchArcNicknames,
} from "@/lib/utilities/api";

export const useArcManagement = (
  selectedServer: string,
  members: Member[],
  setMembers: (members: Member[]) => void
) => {
  const [selectedArc, setSelectedArc] = useState<Arc | null>(null);
  const [isSavingArc, setIsSavingArc] = useState(false);

  useEffect(() => {
    const loadArcNicknames = async () => {
      if (selectedArc) {
        try {
          const arcNicknames = await fetchArcNicknames(selectedArc.id);

          const updatedMembers = members.map((member: Member) => {
            const arcNickname = arcNicknames.find(
              (an) => an.user_id === member.user_id
            );
            return arcNickname
              ? { ...member, nickname: arcNickname.nickname }
              : member;
          });

          setMembers(updatedMembers);
        } catch (error) {
          console.error("Failed to fetch arc nicknames:", error);
        }
      }
    };

    loadArcNicknames();
  }, [selectedArc, setMembers, members]);

  const handleSaveArc = async () => {
    if (!selectedServer || !selectedArc || !selectedArc.arc_name) {
      alert("Please select a server, arc, and ensure members are loaded.");
      return;
    }

    setIsSavingArc(true);

    try {
      const existingArc = await checkExistingArc(
        selectedServer,
        selectedArc.arc_name
      );

      if (existingArc) {
        const confirmOverwrite = window.confirm(
          "An arc with this name already exists. Do you want to overwrite it with the new set of nicknames?"
        );

        if (!confirmOverwrite) {
          return;
        }

        await deleteArcNicknames(existingArc.id);
      }

      const arc =
        existingArc || (await createArc(selectedServer, selectedArc.arc_name));

      const newNicknames: ArcNickname[] = members.map((member) => ({
        arc_id: arc.id!,
        guild_id: selectedServer,
        user_id: member.user_id,
        nickname: member.nickname,
        userTag: member.userTag || member.username,
      }));

      await saveArcNicknames(newNicknames);
      alert("Arc saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save arc. Please try again.");
    } finally {
      setIsSavingArc(false);
    }
  };

  const handleCreateNewArc = async (newArcName: string) => {
    try {
      const newArc = await createArc(selectedServer, newArcName);
      setSelectedArc(newArc);
    } catch (error) {
      console.error("Failed to create new arc:", error);
      alert("Failed to create new arc. Please try again.");
    }
  };

  return {
    selectedArc,
    setSelectedArc,
    isSavingArc,
    handleSaveArc,
    handleCreateNewArc,
  };
};
