import { UserAdminView, UserOwnerView } from "@/types/user";
import ProfilePageBodyNav from "./profile-page-body-nav";
import { AnimatePresence, motion } from "framer-motion";
import GeneralTab from "../../general-tab/general-tab";
import MerchantTab from "../../merchant-tab/merchant-tab";
import OrdersTab from "../../orders-tab";
import UsersTab from "../../users-tab";
import { RoleType } from "@/types/role";

const tabComponentMap: Record<
  string,
  React.FC<{
    profile: UserAdminView | UserOwnerView;
    currentUser: { id: string; role: RoleType[] };
  }>
> = {
  general: ({ profile, currentUser }) => (
    <GeneralTab profile={profile} currentUser={currentUser} />
  ),
  merchant: ({ profile, currentUser }) => (
    <MerchantTab profile={profile} currentUser={currentUser} />
  ),
  orders: OrdersTab,
  users: UsersTab,
};

const ProfilePageBody = ({
  profile,
  activeTab,
  setActiveTab,
  currentUser,
}: {
  profile: UserAdminView | UserOwnerView | null;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  currentUser: { id: string; role: RoleType[] } | null;
}) => {
  if (!currentUser) {
    return <></>;
  }
  return (
    <>
      {profile ? (
        <>
          <ProfilePageBodyNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="flex-1 ml-4 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow p-6 min-h-full"
              >
                {(() => {
                  const Component = tabComponentMap[activeTab];
                  if (!Component)
                    return (
                      <p className="text-black">
                        {"errors.users.user.profile.tab"}
                      </p>
                    );
                  return (
                    <Component profile={profile} currentUser={currentUser} />
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfilePageBody;
