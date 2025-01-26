import { UserListCard } from '../UserListCard/UserListCard'; 
import { styles } from './UserList.styles';
import { Member } from '@/types/types';

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
          <div key={member.user_id} className="mb-4">
            <UserListCard
              member={member}
              isUpdating={isUpdating === member.user_id}
              onNicknameChange={(nickname) => onNicknameChange(index, nickname)}
              onApplyNickname={() => onApplyNickname(member.user_id, member.nickname)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSUserList;