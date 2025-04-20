"use client";
import { UserAdminView, UserOwnerView } from "@/types/user";
import ProfileTabHeader from "../profile-tab-header";
import { v4 as uuid } from "uuid";
import { ImageType } from "@/types/image";
import ProfileSection from "./profile-section";
import CoordonatesSection from "./coordonates-section";
import { useRef } from "react";
import SaveCancelDeleteSection from "../save-cancel-delete-section";
import { RoleType } from "@/types/role";

const defaultProfilePicture: ImageType = {
  id: uuid(),
  alt: "users.user.profile.general.profile.picture.alt",
  url: "/User.svg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const GeneralTab = ({
  profile,
  currentUser,
}: {
  profile: UserAdminView | UserOwnerView;
  currentUser: { id: string; role: RoleType[] };
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileRef = useRef<{ getData: () => any }>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coordinatesBuyerRef = useRef<{ getData: () => any }>(null);
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
        headerTitle="users.user.profile.general.title"
      />
      <ProfileSection
        ref={profileRef}
        isOwner={isOwner}
        roles={currentUser.role}
        deleted={
          !isOwner && currentUser.role.includes(RoleType.ADMIN)
            ? (profile as UserAdminView).deleted
            : undefined
        }
        profilePicture={profile.profilePicture ?? defaultProfilePicture}
        description={profile.description ?? ""}
        email={profile.email ?? ""}
        pseudo={profile.pseudo}
        fullName={profile.fullName ?? ""}
        rating={profile.rating ?? 3.5}
        wallet={
          currentUser.id === profile.id
            ? (profile as UserOwnerView).wallet
            : undefined
        }
      />
      {isOwner && (
        <CoordonatesSection
          roles={currentUser.role}
          isOwner={isOwner}
          profile={profile}
          ref={coordinatesBuyerRef}
          appNo={profile.addressBuyer?.apptNo ?? undefined}
          city={profile.addressBuyer?.city ?? ""}
          country={profile.addressBuyer?.country ?? ""}
          no={profile.addressBuyer?.no ?? 1}
          phone={profile.phoneBuyer ?? ""}
          road={profile.addressBuyer?.road ?? ""}
          state={profile.addressBuyer?.state ?? ""}
          zipCode={profile.addressBuyer?.zip ?? ""}
        />
      )}
      <SaveCancelDeleteSection
        userId={profile.id}
        roles={currentUser.role}
        isOwner={isOwner}
        profileDataFn={() => profileRef.current?.getData()}
        coordinatesBuyerDatafn={() => coordinatesBuyerRef.current?.getData()}
      />
    </div>
  );
};

export default GeneralTab;
