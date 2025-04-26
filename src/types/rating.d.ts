import { v4 as uuid } from "uuid";
import { UserType } from "./user";

export type RatingListType = {
  id: typeof uuid;
  user: UserType;
  ratings: RatingType[];
};

export type RatingType = {
  id: typeof uuid;
  description: string;
  rate: number;
  user: UserType;
};
