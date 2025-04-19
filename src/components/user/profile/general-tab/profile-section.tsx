import InteractiveStarRating from "@/components/interactive-star-rating/interactive-star-rating";
import { ImageType } from "@/types/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Image from "next/image";

type Props = {
  profilePicture: ImageType | File | null;
  wallet: string;
  pseudo: string;
  rating: number;
  deleted: boolean;
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
        fullName: newFullName,
        deleted: deleted,
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
                    value={newPseudo}
                    onChange={handleProfilePseudoChange}
                    className="rounded-xl border pl-2 border-gray-500"
                  />
                </td>
                <td>
                  <button
                    className={`bg-white border-2 ${
                      pseudoChange
                        ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                        : "border-gray-500 text-gray-500"
                    } px-4 py-1 text-sm rounded-lg mr-4`}
                    onClick={
                      pseudoChange ? handleProfilePseudoFallback : () => {}
                    }
                  >
                    {"users.user.profile.pseudo.btn.cancel"}
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="fullName">
                    {"users.user.profile.fullName"}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={newFullName}
                    onChange={handleProfileFullNameChange}
                    className="rounded-xl border pl-2 border-gray-500"
                  />
                </td>
                <td>
                  <button
                    className={`bg-white border-2 ${
                      fullNameChange
                        ? " border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                        : "border-gray-500 text-gray-500"
                    } px-4 py-1 text-sm rounded-lg mr-4`}
                    onClick={
                      fullNameChange ? handleProfileFullNameFallback : () => {}
                    }
                  >
                    {"users.user.profile.fullName.btn.cancel"}
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="emailBtn">{"users.user.profile.email"}</label>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="email"
                    name="emailBtn"
                    id="emailBtn"
                    value={newEmail}
                    onChange={handleProfileEmailChange}
                    className="rounded-xl border pl-2 border-gray-500"
                  />
                </td>
                <td>
                  <button
                    className={`bg-white border-2 ${
                      emailChange
                        ? " border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                        : "border-gray-500 text-gray-500"
                    } px-4 py-1 text-sm rounded-lg mr-4`}
                    onClick={
                      emailChange ? handleProfileEmailFallback : () => {}
                    }
                  >
                    {"users.user.profile.email.btn.cancel"}
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="descriptionBtn">
                    {"users.user.profile.description"}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <textarea
                    name="descriptionBtn"
                    id="descriptionBtn"
                    value={newDescription}
                    onChange={handleProfileDescriptionChange}
                    className="rounded-xl border pl-2 border-gray-500"
                  />
                </td>
                <td>
                  <button
                    className={`bg-white border-2 ${
                      descriptionChange
                        ? " border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                        : "border-gray-500 text-gray-500"
                    } px-4 py-1 text-sm rounded-lg mr-4`}
                    onClick={
                      descriptionChange
                        ? handleProfileDescriptionFallback
                        : () => {}
                    }
                  >
                    {"users.user.profile.description.btn.cancel"}
                  </button>
                </td>
              </tr>
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
              <tr>
                <td>
                  <label>{"users.user.profile.rating"}</label>
                </td>
                <td className="px-4 py-2">
                  <InteractiveStarRating
                    className="w-6 h-8"
                    initialRating={rating}
                    allowHalf={true}
                    disabled={true}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-col gap-2 mb-2 items-center justify-center">
            <div className="flex ">
              <label htmlFor="deletedUser" className="mr-2">
                {"users.user.profile.deleted"}
              </label>
              <input
                id="deletedUser"
                name="deletedUser"
                type="checkbox"
                disabled={true}
                checked={deleted}
                className={""}
                onChange={() => {}}
              />
            </div>
            <div className="flex flex-row gap-2 mb-2">
              <div className="p-4 hidden">
                <input
                  type="file"
                  id="fileProfilePictureInput"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <Image
                src={previewProfilePictureUrl}
                alt={"users.user.profile.picture.alt"}
                width={64}
                height={64}
                className={"bg-gray-900 p-5 m-2"}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="changePictureBtn">
                  {"users.user.profile.picture.btn.label"}
                </label>
                <button
                  id="changePictureBtn"
                  name="changePictureBtn"
                  className="border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300 bg-white border-2 px-4 py-1 rounded-lg mr-4"
                  onClick={() =>
                    document.getElementById("fileProfilePictureInput")?.click()
                  }
                >
                  {"users.user.profile.picture.btn.choose"}
                </button>
                {selectedProfilePicture &&
                  selectedProfilePicture instanceof File && (
                    <span className="mr-4 ">{selectedProfilePicture.name}</span>
                  )}
                <button
                  className={`bg-white border-2 ${
                    profilePictureChange
                      ? " border-blue-500 text-blue-500 hover:bg-gray-300 cursor-pointer"
                      : "border-gray-500 text-gray-500"
                  } px-4 py-1 text-sm rounded-lg mr-4`}
                  onClick={
                    profilePictureChange
                      ? handleProfilePictureFallback
                      : () => {}
                  }
                >
                  {"users.user.profile.picture.btn.cancel"}
                </button>
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
