import { UserListCard } from '../UserListCard/UserListCard';
import { styles } from './UserList.styles';

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
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {members.map((member, index) => (
          <UserListCard
            key={member.user_id}
            member={member}
            isUpdating={isUpdating === member.user_id}
            onNicknameChange={(nickname) => onNicknameChange(index, nickname)}
            onApplyNickname={() => onApplyNickname(member.user_id, member.nickname)}
          />
        ))}
      </div>
    </div>
  );
};

export default DSUserList;