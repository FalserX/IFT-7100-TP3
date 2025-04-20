"use client";
import { UserAdminView, UserOwnerView } from "@/types/user";
import ProfileTabHeader from "../profile-tab-header";
import { useRef } from "react";
import { useParams } from "next/navigation";
import SaveCancelDeleteSection from "../save-cancel-delete-section";
import CoordonatesSection from "./coordonates-section";
import { RoleType } from "@/types/role";
import OptInOptOutSection from "./opt-in-opt-out-section";

const MerchantTab = ({
  profile,
  currentUser,
}: {
  profile: UserAdminView | UserOwnerView;
  currentUser: { id: string; role: RoleType[] };
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coordinatesMerchantRef = useRef<{ getData: () => any }>(null);
  const optInOptOutRef = useRef<{ getData: () => { roles: RoleType[] } }>(null);
  const params = useParams();
  const userId: string = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id ?? "";
  const isOwner = currentUser.id === profile.id;
  if (currentUser.role.includes(RoleType.ADMIN) && !isOwner) {
    profile = profile as UserAdminView;
  } else if (isOwner) {
    profile = profile as UserOwnerView;
  }
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.merchant.title"
      />
      <OptInOptOutSection
        roles={currentUser.role}
        isOwner={isOwner}
        ref={optInOptOutRef}
      />

      <CoordonatesSection
        profile={profile}
        isOwner={isOwner}
        roles={currentUser.role}
        ref={coordinatesMerchantRef}
        appNo={profile.addressMerchant?.apptNo ?? undefined}
        city={profile.addressMerchant?.city ?? ""}
        country={profile.addressMerchant?.country ?? ""}
        no={profile.addressMerchant?.no ?? 1}
        phone={profile.phoneMerchant ?? ""}
        road={profile.addressMerchant?.road ?? ""}
        state={profile.addressMerchant?.state ?? ""}
        zipCode={profile.addressMerchant?.zip ?? ""}
      />
      <SaveCancelDeleteSection
        userId={userId}
        isOwner={isOwner}
        roles={currentUser.role}
        coordinatesMerchantDatafn={() =>
          coordinatesMerchantRef.current?.getData()
        }
        optInOptOutDataFn={() =>
          optInOptOutRef.current?.getData() ?? { roles: [] }
        }
      />
    </div>
  );
};

export default MerchantTab;
