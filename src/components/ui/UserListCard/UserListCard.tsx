import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DSInput, DSButton } from '@/components/';
import { styles } from './UserListCard.styles';
import { Member, Nickname } from '@/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchNicknames } from '@/lib/utilities/api';

interface UserListCardProps {
  member: Member;
  isUpdating: boolean;
  selectedServer: string;
  onNicknameChange: (nickname: string) => void;
  onApplyNickname: () => void;
}

export const UserListCard: React.FC<UserListCardProps> = ({
  member,
  isUpdating,
  selectedServer,
  onNicknameChange,
  onApplyNickname,
}) => {
  const [inputValue, setInputValue] = useState(member.nickname || member.globalName || '');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousNicknames, setPreviousNicknames] = useState<Nickname[]>([]);
  const [isLoadingNicknames, setIsLoadingNicknames] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(member.nickname || member.globalName || '');
    }
  }, [member.nickname, member.globalName, isInputFocused]);

  useEffect(() => {
    const fetchPreviousNicknames = async () => {
      if (isExpanded && selectedServer && member.user_id) {
        setIsLoadingNicknames(true);
        setFetchError(null);
        try {
          const nicknames = await fetchNicknames(selectedServer, member.user_id);
          setPreviousNicknames(nicknames);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error('Failed to fetch nicknames:', error);
          setFetchError('Unable to fetch previous nicknames. Please try again.');
        } finally {
          setIsLoadingNicknames(false);
        }
      }
    };

    fetchPreviousNicknames();
  }, [isExpanded, selectedServer, member.user_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onNicknameChange(e.target.value);
  };

  const handleRevert = () => {
    const globalName = member.globalName || '';
    setInputValue(globalName);
    onNicknameChange(globalName);
  };

  return (
    <div className={styles.card}>
      <div className="flex items-center space-x-4">
        <Image
          src={member.avatar_url}
          alt={`${member.username}'s avatar`}
          width={40}
          height={40}
          className={styles.avatar}
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
        <div className={styles.memberDetails}>
          <DSInput
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder={`Nickname for ${member.username}`}
            className={styles.nicknameInput}
            disabled={isUpdating}
          />
          <div className={styles.username}>
            {member.username}{member.userTag}
          </div>
        </div>
        
        <DSButton
          onClick={onApplyNickname}
          disabled={isUpdating || !inputValue}
          className={styles.applyButton}
        >
          {isUpdating ? 'Applying...' : 'Apply'}
        </DSButton>
        <DSButton
          onClick={handleRevert}
          disabled={isUpdating}
          className={styles.applyButton}
        >
          Revert
        </DSButton>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-neutral-100 transition-all cursor-pointer rounded-lg"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-1 border-t border-neutral-600">
              <div className="flex items-center gap-2 mb-2 text-sm text-neutral-400">
                Saved Nicknames
              </div>
              {isLoadingNicknames ? (
                <div className="text-neutral-400 text-xs">Loading nicknames...</div>
              ) : fetchError ? (
                <div className="text-red-400">{fetchError}</div>
              ) : (
                <div className="flex flex-wrap mb-1 gap-2">
                  {previousNicknames.map((nickname, index) => (
                    <motion.button
                      key={`${nickname.userId}-${nickname.nickname}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 text-sm bg-neutral-700 cursor-pointer transition-all hover:bg-neutral-600 rounded-full"
                      onClick={() => {
                        setInputValue(nickname.nickname);
                        onNicknameChange(nickname.nickname);
                      }}
                    >
                      {nickname.nickname}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserListCard;
