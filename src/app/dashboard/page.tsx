"use client";

import { useState, useEffect } from "react";
import {
  DSButton,
  DSMenu,
  DSUserList,
  DSCreateMenu,
  DSInput,
} from "@/components";
import {
  useServerSelection,
  useMembers,
  useMemberManagement,
  useThemeGenerator,
  useArcManagement,
  useAuth,
} from "@/lib/hooks";
import { Member } from "@/types/types";
import { fetchArcNicknames } from "@/lib/utilities/api";

export default function Dashboard() {
  const { session, status } = useAuth();
  const {
    servers,
    serversError,
    selectedServer,
    selectedServerName,
    handleServerSelection,
  } = useServerSelection();

  const [isLoaded, setIsLoaded] = useState(false);
  const { members: fetchedMembers, error: membersError } =
    useMembers(selectedServer);

  const {
    members,
    isUpdating,
    isApplyingAll,
    handleNicknameChange,
    handleUpdateNickname,
    applyAllNicknames,
    setMembers,
  } = useMemberManagement(selectedServer, fetchedMembers);

  const { theme, setTheme, loading, handleGenerateCharacters } =
    useThemeGenerator(members, setMembers);

  const {
    selectedArc,
    setSelectedArc,
    isSavingArc,
    handleSaveArc,
    handleCreateNewArc,
  } = useArcManagement(selectedServer, members);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const loadArcNicknames = async () => {
      if (selectedArc) {
        try {
          const arcNicknames = await fetchArcNicknames(selectedArc.id);

          setMembers((currentMembers) =>
            currentMembers.map((member) => {
              const arcNickname = arcNicknames.find(
                (an) => an.user_id === member.user_id
              );
              return arcNickname
                ? { ...member, nickname: arcNickname.nickname }
                : member;
            })
          );
        } catch (error) {
          console.error("Failed to fetch arc nicknames:", error);
        }
      }
    };

    loadArcNicknames();
  }, [selectedArc]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (status === "loading") {
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
            <div
              className={`w-auto transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-center font-bold font-[family-name:var(--font-geist-sans)]"></div>
                <label
                  htmlFor="my-drawer-2"
                  className="btn btn-primary drawer-button lg:hidden"
                >
                  Open Menu
                </label>
              </div>

              <div className="flex flex-col">
                <div className="text-4xl text-neutral-600 font-semibold text-center py-5"></div>
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
                      onApplyNickname={(userId: string, nickname: string) =>
                        handleUpdateNickname(userId, nickname, true)
                      }
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
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-neutral-800 border-r border-neutral-700 min-h-full w-80 p-4">
            <div className="space-y-6 mt-3">
              <div className="rounded-md">
                <label className="block text-lg font-medium mb-3">
                  My Servers
                </label>
                <DSMenu
                  items={servers.map((server) => server.name)}
                  placeholder="Select a server"
                  selectedItem={selectedServerName}
                  setSelectedItem={handleServerSelection}
                />
              </div>
              <div className="rounded-md">
                <label className="block text-lg font-medium mb-3">
                  My Arcs
                </label>
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
                      disabled={
                        isApplyingAll ||
                        members.some((m: Member) => !m.nickname)
                      }
                    >
                      {isApplyingAll ? "Applying..." : "Apply Arc"}
                    </DSButton>
                    <DSButton
                      onClick={handleSaveArc}
                      disabled={
                        isSavingArc ||
                        !selectedServer ||
                        !selectedArc ||
                        members.length === 0
                      }
                    >
                      {isSavingArc ? "Saving..." : "Save Arc"}
                    </DSButton>
                  </div>
                </ul>
              </div>

              <div className="border-t border-neutral-700 pt-4">
                <label className="inline-block text-lg font-medium">
                  Arc Studio
                </label>
                <h2 className="inline-block mx-2 font-light text-neutral-500">
                  experimental
                </h2>
                <h3 className="font-light mt-1 text-sm text-neutral-400">
                  Generate themes for arcs and apply them within seconds
                </h3>

                <div className="mt-4">
                  <DSInput
                    className="transition-all bg-neutral-800 border rounded-lg border-neutral-600"
                    placeholder="Enter a movie, show, game, etc"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <div className="flex justify-end space-x-4 mt-3">
                    <DSButton
                      onClick={handleGenerateCharacters}
                      disabled={loading}
                    >
                      Generate
                    </DSButton>
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
