import { RoleType } from "@/types/role";
import { UserAdminView, UserOwnerView } from "@/types/user";
import ProfileTabHeader from "../profile-tab-header";

type Props = {
  currentUser: { id: string; role: RoleType[] };
  profile: UserAdminView | UserOwnerView;
};

const UserTab = ({ currentUser, profile }: Props) => {
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.user.title"
      />
    </div>
  );
};

export default UserTab;
