import { RoleType } from "@/types/role";
import { UserAdminView, UserOwnerView } from "@/types/user";
import ProfileTabHeader from "../profile-tab-header";

type Props = {
  profile: UserAdminView | UserOwnerView;
  currentUser: { id: string; role: RoleType[] };
};

const CartTab = ({ profile, currentUser }: Props) => {
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.cart.title"
      />
    </div>
  );
};

export default CartTab;
