import { ImageType } from "./image";
import { RatingListType } from "./rating";
import { Cart } from "./cart";
import { ProductListType } from "./product";
import { OrderListType } from "./order";
import { APIErrorMessage } from "./auth";
import { RoleType } from "./role";

type UserUpdateInputType = {
  pseudo?: string;
  preferredLanguage?: string | null;
  fullName?: string;
  description?: string;
  deleted?: boolean;
  addressBuyer?: AddressType;
  addressMerchant?: AddressType;
  phoneBuyer?: string;
  phoneMerchant?: string;
  role?: RoleType[];
  profilePicture?: ImageType;
  rating?: number;
  ratingList?: RatingListType;
  productsList?: ProductListType;
  ordersList?: OrderListType;
  email?: string;
};
type AllowedUserFields = keyof UserType;
type UserType = {
  id: string;
  preferredLanguage?: string | null;
  deleted?: boolean;
  wallet: string;
  profilePicture?: ImageType;
  role?: RoleType[];
  pseudo: string;
  fullName?: string;
  productsList?: ProductListType;
  rating: number;
  ratingList: RatingListType[];
  ordersList?: OrderListType;
  cart?: Cart;
  description?: string;
  email?: string;
  addressBuyer?: AddressType;
  addressMerchant?: AddressType;
  phoneBuyer?: string;
  phoneMerchant?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type ReadUsersResult = {
  success: boolean;
  data?:
    | UserType[]
    | Partial<UserType>
    | UserType
    | Record<string, UserFieldSubset>;
  error?: APIErrorMessage;
};
export type WriteUsersResult = Pick<ReadUsersResult, "success" | "error">;

export type AddressType = {
  no: number;
  road: string;
  apptNo?: number;
  city: string;
  zip: string;
  country: string;
  state: string;
};

export type UserFieldSubset<K extends AllowedUserFields = AllowedUserFields> = {
  [P in K]?: UserType[P];
};

export type UserAdminView = Pick<
  UserType,
  | "id"
  | "preferredLanguage"
  | "wallet"
  | "deleted"
  | "pseudo"
  | "productsList"
  | "rating"
  | "ratingList"
  | "description"
  | "addressBuyer"
  | "addressMerchant"
  | "phoneBuyer"
  | "phoneMerchant"
  | "profilePicture"
  | "role"
  | "fullName"
  | "email"
  | "createdAt"
  | "updatedAt"
>;

export type UserPublicView = Pick<
  UserType,
  | "id"
  | "preferredLanguage"
  | "deleted"
  | "pseudo"
  | "productsList"
  | "rating"
  | "ratingList"
  | "description"
  | "addressMerchant"
  | "phoneMerchant"
  | "profilePicture"
  | "email"
>;

export type UserOwnerView = Pick<
  UserType,
  | "id"
  | "wallet"
  | "preferredLanguage"
  | "profilePicture"
  | "role"
  | "pseudo"
  | "fullName"
  | "productsList"
  | "rating"
  | "ordersList"
  | "cart"
  | "description"
  | "email"
  | "addressBuyer"
  | "addressMerchant"
  | "phoneBuyer"
  | "phoneMerchant"
>;

export type UserAdminUpdateInputType = Pick<
  UserUpdateInputType,
  "deleted" | "role" | "rating" | "ratingList"
>;

export type UserOwnerUpdateInputType = Pick<
  UserUpdateInputType,
  | "pseudo"
  | "preferredLanguage"
  | "fullName"
  | "description"
  | "deleted"
  | "addressBuyer"
  | "addressMerchant"
  | "phoneBuyer"
  | "phoneMerchant"
  | "role"
  | "profilePicture"
  | "productsList"
  | "ordersList"
  | "email"
>;
