import { ImageType } from "./image";
import { RoleType } from "./role";

type ProfilePageHeaderType = {
  profilePicture?: ImageType;
  profilePseudo: string;
};

type ProfilePageBodyTabsType = {
  id: string;
  label: string;
  role: RoleType[];
};
