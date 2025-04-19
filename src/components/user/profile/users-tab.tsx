import { UserAdminView, UserOwnerView } from "@/types/user";

const UsersTab = ({ profile }: { profile: UserAdminView | UserOwnerView }) => {
  return (
    <div>
      <h2>{"users.user.profile.users"}</h2>
      <p>{profile.email}</p>
    </div>
  );
};

export default UsersTab;
