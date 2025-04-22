import { deleteUser, updatePatchUser } from "@/libs/user-service";
import { RoleType } from "@/types/role";
import { AddressType } from "@/types/user";

type Props = {
  userId: string;
  isOwner: boolean;
  roles: RoleType[];
  optInOptOutDataFn?: () => { roles: RoleType[] };
  profileDataFn?: () => Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coordinatesMerchantDatafn?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coordinatesBuyerDatafn?: () => any;
};
const SaveCancelDeleteSection = ({
  userId,
  isOwner,
  roles,
  profileDataFn,
  coordinatesBuyerDatafn,
  coordinatesMerchantDatafn,
  optInOptOutDataFn,
}: Props) => {
  const handleSave = async (
    userId: string,
    profileDataFn?: () => Record<string, unknown>,
    // ici tu reçois bien la fonction, pas les données
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coordinatesBuyerDataFn?: () => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coordinatesMerchantDataFn?: () => any,
    optInOptOutDataFn?: () => { roles: RoleType[] }
  ) => {
    if (!userId) {
      console.error("errors.users.user.profile.data.access");
      return;
    }

    const profileData = profileDataFn?.() ?? {};
    const buyerData = coordinatesBuyerDataFn?.() ?? {};
    const merchantData = coordinatesMerchantDataFn?.() ?? {};
    const optData: { roles?: RoleType[] } = optInOptOutDataFn?.() ?? {};

    const fullData: Record<string, unknown> = {};

    // Profil
    if (profileData && typeof profileData === "object") {
      Object.assign(fullData, profileData);
    }

    // Buyer
    if (buyerData && typeof buyerData === "object") {
      const addressBuyer: AddressType = {
        city: buyerData.city,
        country: buyerData.country,
        no: buyerData.no,
        road: buyerData.road,
        state: buyerData.state,
        zip: buyerData.zipCode,
        apptNo: buyerData.appNo,
      };
      fullData.addressBuyer = addressBuyer;
      fullData.phoneBuyer = buyerData.phone;
    }

    // Merchant
    if (merchantData && typeof merchantData === "object") {
      const addressMerchant: AddressType = {
        city: merchantData.city,
        country: merchantData.country,
        no: merchantData.no,
        road: merchantData.road,
        state: merchantData.state,
        zip: merchantData.zipCode,
        apptNo: merchantData.appNo,
      };
      fullData.addressMerchant = addressMerchant;
      fullData.phoneMerchant = merchantData.phone;
    }
    if (optData?.roles) {
      fullData.role = optData.roles;
    }
    try {
      await updatePatchUser(userId, window.location.origin, fullData);
      await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      window.location.reload();
    } catch (err) {
      throw new Error(`errors.users.user.profile.data.update . ${err}`);
    }
  };
  const handleDelete = async (userId: string) => {
    if (!userId) {
      throw new Error(`errors.users.user.profile.data.access`);
    }
    try {
      await deleteUser(userId, window.location.origin);
      window.location.reload();
    } catch (error) {
      throw new Error(`errors.users.user.profile.data.delete. ${error}`);
    }
  };
  const handleCancel = async () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-row border-2 gap-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <div className="flex flex-row gap-64 ml-6 m-2">
        <button
          disabled={!isOwner || !roles.includes(RoleType.ADMIN)}
          onClick={() => {
            handleDelete(userId);
          }}
          className="border rounded-2xl border-red-600 p-2 text-black shadow-2xl cursor-pointer hover:bg-red-600 hover:text-white"
        >
          {"users.user.profile.delete.btn.label"}
        </button>
        <button
          disabled={!isOwner}
          onClick={handleCancel}
          className="border rounded-2xl border-blue-500 p-2 text-black shadow-2xl cursor-pointer hover:bg-gray-300"
        >
          {"users.user.profile.cancel.btn.label"}
        </button>
        <button
          disabled={!isOwner}
          onClick={() => {
            handleSave(
              userId,
              profileDataFn,
              coordinatesBuyerDatafn,
              coordinatesMerchantDatafn,
              optInOptOutDataFn
            );
          }}
          className="border rounded-2xl p-2 bg-blue-500 border-white text-white cursor-pointer shadow-2xl hover:bg-blue-700 hover:text-white"
        >
          {"users.user.profile.save.btn.label"}
        </button>
      </div>
    </div>
  );
};

export default SaveCancelDeleteSection;
