import { ProductType } from "@/types/product";
import { v4 as uuid } from "uuid";

const Product: React.FC<ProductType> = ({
  id: uuid,
  cost: number,
  name: string,
  qty: number,
  merchant: Merchant,
}) => {
  return <></>;
};

export const Product;
