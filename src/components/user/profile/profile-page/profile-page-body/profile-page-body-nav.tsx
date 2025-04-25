import { useLocale } from "@/contexts/locale-context";
const ProfilePageBodyNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { getLocaleString } = useLocale();

  const ProfilePageBodyTabs: { id: string; label: string }[] = [
    {
      id: "general",
      label: `${getLocaleString("users.user.profile.general.title")}`,
    },
    {
      id: "products",
      label: `${getLocaleString("users.user.profile.product.list.title")}`,
    },
    {
      id: "cart",
      label: `${getLocaleString("users.user.profile.cart.title")}`,
    },
    {
      id: "order",
      label: `${getLocaleString("users.user.profile.order.title")}`,
    },
  ];

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
