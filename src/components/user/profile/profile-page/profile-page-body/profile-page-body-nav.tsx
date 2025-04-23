const ProfilePageBodyTabs: { id: string; label: string }[] = [
  {
    id: "general",
    label: "users.user.profile.general.btn.label",
  },
  {
    id: "products",
    label: "users.user.profile.products.btn.label",
  },
  {
    id: "cart",
    label: "users.user.profile.cart.btn.label",
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
