import InteractiveStarRating from "@/components/interactive-star-rating/interactive-star-rating";
import { ImageType } from "@/types/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Image from "next/image";
import { RoleType } from "@/types/role";

type Props = {
  profilePicture: ImageType | File | null;
  roles: RoleType[];
  isOwner: boolean;
  wallet?: string;
  pseudo: string;
  rating: number;
  deleted?: boolean;
  description: string;
  email: string;
  fullName: string;
};

export type ProfileData = Omit<Props, "wallet">;

type ProfileSectionRef = {
  getData: () => ProfileData;
};

const ProfileSection = forwardRef<ProfileSectionRef, Props>(
  (
    {
      isOwner,
      roles,
      profilePicture,
      pseudo,
      rating,
      description,
      deleted,
      email,
      wallet,
      fullName,
    },
    ref
  ) => {
    const [profilePictureChange, setProfilePictureChange] =
      useState<boolean>(false);
    const [descriptionChange, setDescriptionChange] = useState<boolean>(false);
    const [emailChange, setEmailChange] = useState<boolean>(false);
    const [fullNameChange, setFullNameChange] = useState<boolean>(false);
    const [pseudoChange, setPseudoChange] = useState<boolean>(false);
    const [newPseudo, setNewPseudo] = useState<string>(pseudo);
    const [newDescription, setNewDescription] = useState<string>(description);
    const [newEmail, setNewEmail] = useState<string>(email);
    const [newFullName, setNewFullName] = useState<string>(fullName);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<
      File | ImageType | null
    >(null);
    const [previewProfilePictureUrl, setPreviewProfilePictureUrl] =
      useState<string>(
        profilePicture && "url" in profilePicture ? profilePicture.url : ""
      );
    const [newProfilePicture, setNewProfilePicture] = useState<boolean>(false);

    const handleProfilePseudoChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const newPseudo = event.target.value;
      setNewPseudo(newPseudo);
      setPseudoChange(true);
    };
    const handleProfilePseudoFallback = (): void => {
      setNewPseudo(pseudo);
      setPseudoChange(false);
    };
    const handleProfileDescriptionChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
      const newDescription = event.target.value;
      setNewDescription(newDescription);
      setDescriptionChange(true);
    };
    const handleProfileDescriptionFallback = (): void => {
      setNewDescription(description);
      setDescriptionChange(false);
    };
    const handleProfileEmailChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const newEmail = event.target.value;
      setNewEmail(newEmail);
      setEmailChange(true);
    };
    const handleProfileEmailFallback = (): void => {
      setNewEmail(email);
      setEmailChange(false);
    };

    const handleProfileFullNameChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const newFullName = event.target.value;
      setNewFullName(newFullName);
      setFullNameChange(true);
    };
    const handleProfileFullNameFallback = (): void => {
      setNewFullName(fullName);
      setFullNameChange(false);
    };
    useEffect(() => {
      return () => {
        if (previewProfilePictureUrl && newProfilePicture) {
          URL.revokeObjectURL(previewProfilePictureUrl);
          setNewProfilePicture(false);
          setProfilePictureChange(false);
        }
      };
    }, [previewProfilePictureUrl, newProfilePicture, setProfilePictureChange]);

    const handleProfilePictureChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const file: File | null = event.target.files?.[0] || null;
      if (file) {
        setSelectedProfilePicture(file);
        setNewProfilePicture(true);
        setPreviewProfilePictureUrl(URL.createObjectURL(file));
        setProfilePictureChange(true);
      }
    };
    const handleProfilePictureFallback = (): void => {
      if (previewProfilePictureUrl) {
        URL.revokeObjectURL(previewProfilePictureUrl);
      }
      setSelectedProfilePicture(profilePicture);
      setNewProfilePicture(false);
      setProfilePictureChange(false);
      setPreviewProfilePictureUrl(
        profilePicture && "url" in profilePicture ? profilePicture.url : ""
      );
    };
    useImperativeHandle(ref, () => ({
      getData: (): ProfileData => ({
        isOwner: isOwner,
        roles: roles,
        fullName: newFullName,
        pseudo: newPseudo,
        email: newEmail,
        description: newDescription,
        profilePicture: selectedProfilePicture ?? profilePicture,
        rating: 0,
      }),
    }));
    return (
      <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
        <h3 className="mt-2 ml-2 font-bold text-gray-600">
          {"users.user.profile.generic.title"}
        </h3>
        <div className="flex flex-row gap-2">
          <table
            id="profileSectionGeneric"
            className="w-[40vw] text-black m-2 table-auto border-spacing-4"
          >
            <tbody>
              <tr>
                <td>
                  <label htmlFor="pseudoName">
                    {"users.user.profile.pseudo"}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="pseudoName"
                    id="pseudoName"
                    disabled={!isOwner}
                    value={newPseudo}
                    onChange={handleProfilePseudoChange}
                    className={`rounded-xl border pl-2 border-gray-500 ${
                      isOwner ? "bg-white" : "bg-gray-300"
                    }`}
                  />
                </td>
                {isOwner && (
                  <td>
                    <button
                      disabled={!isOwner}
                      className={`bg-white border-2 ${
                        pseudoChange && isOwner
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        pseudoChange && isOwner
                          ? handleProfilePseudoFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.pseudo.btn.cancel"}
                    </button>
                  </td>
                )}
              </tr>
              {isOwner && (
                <tr>
                  <td>
                    <label htmlFor="fullName">
                      {"users.user.profile.fullName"}
                    </label>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      disabled={!isOwner}
                      name="fullName"
                      id="fullName"
                      value={newFullName}
                      onChange={handleProfileFullNameChange}
                      className={`rounded-xl border pl-2 border-gray-500 ${
                        isOwner ? "bg-white" : "bg-gray-300"
                      }`}
                    />
                  </td>
                  <td>
                    <button
                      disabled={!isOwner}
                      className={`bg-white border-2 ${
                        fullNameChange && isOwner
                          ? " border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        fullNameChange && isOwner
                          ? handleProfileFullNameFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.fullName.btn.cancel"}
                    </button>
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <label htmlFor="emailBtn">{"users.user.profile.email"}</label>
                </td>
                <td className="px-4 py-2">
                  <input
                    disabled={!isOwner}
                    type="email"
                    name="emailBtn"
                    id="emailBtn"
                    value={newEmail}
                    onChange={handleProfileEmailChange}
                    className={`rounded-xl border pl-2 border-gray-500 ${
                      isOwner ? "bg-white" : "bg-gray-300"
                    }`}
                  />
                </td>
                {isOwner && (
                  <td>
                    <button
                      disabled={!isOwner}
                      className={`bg-white border-2 ${
                        emailChange && isOwner
                          ? " border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        emailChange && isOwner
                          ? handleProfileEmailFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.email.btn.cancel"}
                    </button>
                  </td>
                )}
              </tr>
              <tr>
                <td>
                  <label htmlFor="descriptionBtn">
                    {"users.user.profile.description"}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <textarea
                    disabled={!isOwner}
                    name="descriptionBtn"
                    id="descriptionBtn"
                    value={newDescription}
                    onChange={handleProfileDescriptionChange}
                    className={`rounded-xl border pl-2 border-gray-500 ${
                      isOwner ? "bg-white" : "bg-gray-300"
                    }`}
                  />
                </td>
                <td>
                  {isOwner && (
                    <button
                      disabled={!isOwner}
                      className={`bg-white border-2 ${
                        descriptionChange && isOwner
                          ? " border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } px-4 py-1 text-sm rounded-lg mr-4`}
                      onClick={
                        descriptionChange && isOwner
                          ? handleProfileDescriptionFallback
                          : () => {}
                      }
                    >
                      {"users.user.profile.description.btn.cancel"}
                    </button>
                  )}
                </td>
              </tr>
              {wallet && isOwner && (
                <tr>
                  <td>
                    <label htmlFor="walletAddressID">
                      {"users.user.profile.wallet"}
                    </label>
                  </td>
                  <td colSpan={2} className="px-4 py-2">
                    <input
                      disabled={true}
                      readOnly
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      onKeyDown={(e) => {
                        if (e.ctrlKey && (e.key === "c" || e.key === "x")) {
                          e.preventDefault();
                        }
                      }}
                      type="text"
                      name="walletAddressID"
                      id="walletAddressID"
                      value={wallet}
                      onChange={() => {}}
                      className="rounded-xl border pl-2 min-w-full border-gray-500 bg-gray-300 select-none"
                    />
                  </td>
                  <td></td>
                </tr>
              )}
              <tr>
                <td>
                  <label>{"users.user.profile.rating"}</label>
                </td>
                <td className="px-4 py-2">
                  <InteractiveStarRating
                    className="w-6 h-8"
                    initialRating={rating}
                    allowHalf={true}
                    disabled={isOwner || !roles.includes(RoleType.ADMIN)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col gap-2 mb-2 items-center justify-center">
            {!isOwner && roles.includes(RoleType.ADMIN) && (
              <div className="flex ">
                <label htmlFor="deletedUser" className="mr-2">
                  {"users.user.profile.deleted"}
                </label>
                <input
                  id="deletedUser"
                  name="deletedUser"
                  type="checkbox"
                  disabled={deleted}
                  checked={deleted}
                  className={""}
                  onChange={() => {}}
                />
              </div>
            )}
            <div className="flex flex-row gap-2 mb-2">
              {isOwner && (
                <div className="p-4 hidden">
                  <input
                    type="file"
                    id="fileProfilePictureInput"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              )}
              <Image
                src={previewProfilePictureUrl}
                alt={"users.user.profile.picture.alt"}
                width={64}
                height={64}
                className={"bg-gray-900 p-5 m-2 mt-8 w-[100px] h-[100px]"}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="changePictureBtn">
                  {"users.user.profile.picture.btn.label"}
                </label>
                {isOwner && (
                  <button
                    disabled={!isOwner}
                    id="changePictureBtn"
                    name="changePictureBtn"
                    className={`${
                      isOwner
                        ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                        : "border-gray-500 text-gray-500"
                    } bg-white border-2 px-4 py-1 rounded-lg mr-4`}
                    onClick={
                      isOwner
                        ? () =>
                            document
                              .getElementById("fileProfilePictureInput")
                              ?.click()
                        : () => {}
                    }
                  >
                    {"users.user.profile.picture.btn.choose"}
                  </button>
                )}

                <span className="mr-4 border-2 min-h-[30px] rounded-xl border-gray-400">
                  {selectedProfilePicture &&
                    selectedProfilePicture instanceof File &&
                    selectedProfilePicture.name}
                </span>

                {(isOwner || roles.includes(RoleType.ADMIN)) && (
                  <button
                    disabled={!isOwner}
                    className={`bg-white border-2 ${
                      profilePictureChange && isOwner
                        ? " border-blue-500 text-blue-500 hover:bg-gray-300 cursor-pointer"
                        : "border-gray-500 text-gray-500"
                    } px-4 py-1 text-sm rounded-lg mr-4`}
                    onClick={
                      profilePictureChange && isOwner
                        ? handleProfilePictureFallback
                        : () => {}
                    }
                  >
                    {"users.user.profile.picture.btn.cancel"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProfileSection.displayName = "ProfileSection";

export default ProfileSection;
