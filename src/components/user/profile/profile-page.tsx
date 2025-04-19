import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserAdminView, UserOwnerView } from "../../../types/user";
import Image from "next/image";
import { RoleType } from "@/types/role";
import GeneralTab from "./general-tab/general-tab";
import OrdersTab from "./orders-tab";
import UsersTab from "./users-tab";
import {
  ProfilePageBodyTabsType,
  ProfilePageHeaderType,
} from "../../../types/profile";

const ProfilePageBodyTabs: ProfilePageBodyTabsType[] = [
  {
    id: "general",
    label: "users.user.profile.general.btn.label",
    role: [RoleType.BUYER, RoleType.VENDOR, RoleType.ADMIN],
  },
  {
    id: "merchant",
    label: "users.user.profile.merchant.btn.label",
    role: [RoleType.VENDOR, RoleType.BUYER, RoleType.ADMIN],
  },
  {
    id: "cart",
    label: "users.user.profile.cart",
    role: [RoleType.BUYER, RoleType.ADMIN, RoleType.VENDOR],
  },
  {
    id: "orders",
    label: "users.user.profile.orders",
    role: [RoleType.BUYER, RoleType.ADMIN, RoleType.VENDOR],
  },
  {
    id: "products",
    label: "users.user.profile.products.btn.label",
    role: [RoleType.VENDOR, RoleType.ADMIN],
  },
  {
    id: "users",
    label: "users.user.profile.users.btn.label",
    role: [RoleType.ADMIN],
  },
];

const tabComponentMap: Record<
  string,
  React.FC<{ profile: UserAdminView | UserOwnerView }>
> = {
  general: GeneralTab,
  orders: OrdersTab,
  users: UsersTab,
};

const ProfilePageHeader = ({
  profilePicture,
  profilePseudo,
}: ProfilePageHeaderType) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row m-2 gap-2">
        {profilePicture && (
          <div className="border-2 p-3 rounded-2xl inset-shadow-xs shadow-blue-950">
            <Image
              src={profilePicture.url}
              alt={profilePicture.alt}
              width={30}
              height={30}
            />
          </div>
        )}
        <span className="flex items-center">{profilePseudo}</span>
      </div>
    </div>
  );
};

const ProfilePageBodyNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <aside className="w-1/4 bg-white rounded-xl shadow p-4 space-y-2">
      {ProfilePageBodyTabs.map((tab) => {
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-200 text-gray-950"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </aside>
  );
};

const ProfilePageBody = ({
  profile,
  activeTab,
  setActiveTab,
}: {
  profile: UserAdminView | UserOwnerView | null;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex bg-transparent pl-4 rounded-xl shadow">
      <div className="flex min-h-screen min-w-[98vw] text-black bg-gray-500 rounded-2xl p-4">
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
                    return <Component profile={profile} />;
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const ProfilePage = ({ userId }: { userId: string }) => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [profile, setProfile] = useState<UserAdminView | UserOwnerView | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number>(200);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          setError("errors.users.user.read");
          setErrorStatus(response.status);
        }

        const data = await response.json();
        setProfile(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "errors.unknown");
        setErrorStatus(500);
      }
    };
    fetchProfile();
  }, [userId]);

  if (error) {
    return (
      <div>
        {errorStatus} : {error}
      </div>
    );
  }

  if (!profile) {
    return <div>{"users.user.loading"}</div>;
  }

  return (
    <div className="flex flex-col">
      <ProfilePageHeader
        profilePseudo={profile.pseudo}
        profilePicture={profile.profilePicture}
      />
      <hr className="border-transparent border-8" />
      <ProfilePageBody
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default ProfilePage;
