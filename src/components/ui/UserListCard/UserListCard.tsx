import Image from 'next/image';
import { DSInput, DSButton } from '@/components';
import { styles } from './UserListCard.styles';

interface UserListCardProps {
  member: {
    user_id: string;
    username: string;
    nickname: string;
    tag: string;
    avatar_url: string;
  };
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
  return (
    <div className={styles.memberItem}>
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
          value={member.nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
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
        disabled={isUpdating || !member.nickname}
      >
        {isUpdating ? 'Applying...' : 'Apply'}
      </DSButton>
    </div>
  );
};

export default UserListCard;