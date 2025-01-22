// components/UserList.tsx
import Image from 'next/image';
import { DSInput, DSButton } from '@/components';
import { styles } from './UserList.styles'; // Import styles

interface Member {
  user_id: string;
  username: string;
  nickname: string;
  tag: string;
  avatar_url: string;
}

interface UserListProps {
  members: Member[];
  isUpdating: string | null;
  onNicknameChange: (index: number, nickname: string) => void;
  onApplyNickname: (userId: string, nickname: string) => void;
}

export const DSUserList: React.FC<UserListProps> = ({
  members,
  isUpdating,
  onNicknameChange,
  onApplyNickname,
}) => {
  return (
    <div className={styles.container}>
      {members.map((member, index) => (
        <div key={member.user_id} className={styles.memberItem}>
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
              onChange={(e) => onNicknameChange(index, e.target.value)}
              placeholder={`Nickname for ${member.username}`}
              className={styles.nicknameInput}
              disabled={isUpdating === member.user_id}
            />
            <div className={styles.username}>
              {member.username}{member.tag}
            </div>
          </div>
          
          <DSButton
            onClick={() => onApplyNickname(member.user_id, member.nickname)}
            disabled={isUpdating === member.user_id || !member.nickname}
          >
            {isUpdating === member.user_id ? 'Applying...' : 'Apply'}
          </DSButton>
        </div>
      ))}
    </div>
  );
};

export default DSUserList;