import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DSInput, DSButton } from '@/components/';
import { styles } from './UserListCard.styles';
import { Member } from '@/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UserListCardProps {
  member: Member;
  isUpdating: boolean;
  onNicknameChange: (nickname: string) => void;
  onApplyNickname: () => void;
}

export const UserListCard: React.FC<UserListCardProps> = ({
  member,
  isUpdating,
  onNicknameChange,
  onApplyNickname,
}) => {
  const [inputValue, setInputValue] = useState(member.nickname || member.globalName || '');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const previousNicknames = ['Nickname1', 'Nickname2', 'Nickname3'];

  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(member.nickname || member.globalName || '');
    }
  }, [member.nickname, member.globalName, isInputFocused]);

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
        
        {previousNicknames.length > 0 && (
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
        )}
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
            <div className="mt-4 pt-4 border-t border-neutral-400">
              <div className="flex items-center gap-2 mb-2 text-sm text-neutral-300">
                Previous nicknames
              </div>
              <div className="flex flex-wrap gap-2">
                {previousNicknames.map((name, index) => (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 text-sm bg-neutral-900 cursor-pointer transition-all hover:bg-neutral-700 rounded-lg"
                    onClick={() => {
                      setInputValue(name);
                      onNicknameChange(name);
                    }}
                  >
                    {name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserListCard;