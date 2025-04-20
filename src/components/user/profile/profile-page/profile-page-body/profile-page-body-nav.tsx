import { ProfilePageBodyTabsType } from "@/types/profile";
import { RoleType } from "@/types/role";

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

export default ProfilePageBodyNav;
