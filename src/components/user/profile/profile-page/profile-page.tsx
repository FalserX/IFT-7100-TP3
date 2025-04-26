import { useState } from "react";
import ProfilePageBody from "./profile-page-body/profile-page-body";
import { useWallet } from "@/contexts/wallet-context";

const ProfilePage = ({
  userId,
  tabActive,
}: {
  userId: string;
  tabActive?: string;
}) => {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState<string>(
    tabActive ? tabActive : "general"
  );
  return (
    <>
      {userId === address ? (
        <div className="flex flex-col">
          <div className="flex bg-transparent pl-4 rounded-xl shadow">
            <div className="flex min-h-screen min-w-[98vw] text-black bg-gray-500 rounded-2xl p-4">
              <ProfilePageBody
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfilePage;
