import { motion } from "framer-motion";
import { UserListCard } from "../UserListCard/UserListCard";
import { styles } from "./UserList.styles";
import { Member } from "@/types/types";

interface UserListProps {
  members: Member[];
  isUpdating: string | null;
  selectedServer: string;
  onNicknameChange: (index: number, nickname: string) => void;
  onApplyNickname: (userId: string, nickname: string) => void;
}

const roleGroupVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.2,
      duration: 0.5,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.4,
    },
  }),
};

export const DSUserList: React.FC<UserListProps> = ({
  members,
  isUpdating,
  selectedServer,
  onNicknameChange,
  onApplyNickname,
}) => {
  const groupedMembers = members.reduce((acc: Record<string, Member[]>, member) => {
    const highestRole = member.roles[0]?.name || "No Role";
    if (!acc[highestRole]) {
      acc[highestRole] = [];
    }
    acc[highestRole].push(member);
    return acc;
  }, {});

  console.log(selectedServer)

  const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
    const roleAPosition = members.find((m) => m.roles[0]?.name === a)?.roles[0]?.position ?? -1;
    const roleBPosition = members.find((m) => m.roles[0]?.name === b)?.roles[0]?.position ?? -1;
    return roleBPosition - roleAPosition;
  });

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {sortedRoles.map((roleName, roleIndex) => (
          <motion.div
            key={roleName}
            custom={roleIndex}
            initial="hidden"
            animate="visible"
            variants={roleGroupVariants}
          >
            <div className="text-md font-semibold border-b border-neutral-700 pb-2 mb-4">
              {roleName}
            </div>
            {groupedMembers[roleName].map((member, memberIndex) => (
              <motion.div
                key={`${member.user_id}`} 
                className="mb-4"
                custom={memberIndex}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <UserListCard
                  member={member}
                  selectedServer={selectedServer}
                  isUpdating={isUpdating === member.user_id}
                  onNicknameChange={(nickname) => {
                    const originalIndex = members.findIndex(m => m.user_id === member.user_id);
                    onNicknameChange(originalIndex, nickname);
                  }}
                  onApplyNickname={() => onApplyNickname(member.user_id, member.nickname)}
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DSUserList;


