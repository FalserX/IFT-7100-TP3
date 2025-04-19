"use client";
import { AddressType, UserAdminView, UserOwnerView } from "@/types/user";
import ProfileTabHeader from "../profile-tab-header";
import { v4 as uuid } from "uuid";
import { ImageType } from "@/types/image";
import ProfileSection from "./profile-section";
import CoordonatesSection from "./coordonates-section";
import { useRef } from "react";
import { useParams } from "next/navigation";
import { updateUser } from "@/libs/user-service";

const defaultProfilePicture: ImageType = {
  id: uuid(),
  alt: "users.user.profile.general.profile.picture.alt",
  url: "/User.svg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const GeneralTab = ({
  profile,
}: {
  profile: UserAdminView | UserOwnerView;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileRef = useRef<{ getData: () => any }>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coordinatesRef = useRef<{ getData: () => any }>(null);
  const params = useParams();

  const handleCancel = async () => {
    window.location.reload();
  };
  const handleSave = async () => {
    const profileData = profileRef.current?.getData();
    const coordinatesData = coordinatesRef.current?.getData();
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    if (!userId || !profileData || !coordinatesData) {
      console.error("errors.users.user.profile.data.access");
      return;
    }
    const newCoordinatesDataAddress: AddressType = {
      city: coordinatesData.city,
      country: coordinatesData.country,
      no: coordinatesData.no,
      road: coordinatesData.road,
      state: coordinatesData.state,
      zip: coordinatesData.zipCode,
      apptNo: coordinatesData.appNo,
    };
    const newPhoneBuyer: string = coordinatesData.phone;

    const coordinates: {
      addressBuyer: AddressType | undefined;
      phoneBuyer: string | undefined;
    } = {
      addressBuyer: newCoordinatesDataAddress,
      phoneBuyer: newPhoneBuyer,
    };
    const fullData = {
      ...profileData,
      ...coordinates,
    };
    try {
      await updateUser(userId, fullData);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.general.title"
      />
      <ProfileSection
        ref={profileRef}
        deleted={profile.deleted ?? false}
        profilePicture={profile.profilePicture ?? defaultProfilePicture}
        description={profile.description ?? ""}
        email={profile.email ?? ""}
        pseudo={profile.pseudo}
        fullName={profile.fullName ?? ""}
        rating={profile.rating ?? 3.5}
        wallet={profile.wallet ?? ""}
      />
      <CoordonatesSection
        ref={coordinatesRef}
        appNo={profile.addressBuyer?.apptNo ?? undefined}
        city={profile.addressBuyer?.city ?? ""}
        country={profile.addressBuyer?.country ?? ""}
        no={profile.addressBuyer?.no ?? 1}
        phone={profile.phoneBuyer ?? ""}
        road={profile.addressBuyer?.road ?? ""}
        state={profile.addressBuyer?.state ?? ""}
        zipCode={profile.addressBuyer?.zip ?? ""}
      />
      <div className="flex flex-row border-2 gap-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <div className="flex flex-row gap-64 ml-6 m-2">
          <button
            onClick={() => {}}
            className="border rounded-2xl border-red-600 p-2 text-black shadow-2xl cursor-pointer hover:bg-red-600 hover:text-white"
          >
            {"users.user.profile.delete.btn.label"}
          </button>
          <button
            onClick={handleCancel}
            className="border rounded-2xl border-blue-500 p-2 text-black shadow-2xl cursor-pointer hover:bg-gray-300"
          >
            {"users.user.profile.cancel.btn.label"}
          </button>
          <button
            onClick={handleSave}
            className="border rounded-2xl p-2 bg-blue-500 border-white text-white cursor-pointer shadow-2xl hover:bg-blue-700 hover:text-white"
          >
            {"users.user.profile.save.btn.label"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
