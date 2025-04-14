import { v4 as uuid } from "uuid";
import { Merchant } from "./merchant";

export type Product = {
  id: uuid;
  cost: number;
  name: string;
  qty: number;
  merchant: Merchant;
};
