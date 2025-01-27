import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DSInput, DSButton } from '@/components/';
import { styles } from './UserListCard.styles';
import { Member } from '@/types/types';

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
            {member.username}{member.tag}
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
      </div>
    </div>
  );
};

export default UserListCard;