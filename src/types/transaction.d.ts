export type RawTransaction = {
  buyerAddress: string;
  productId: string | number;
  quantity: string | number;
  timestampRaw: string | bigint;
};

export type Transaction = {
  buyerAddress: string;
  productId: string | number;
  quantity: string | number;
  timestamp: Date;
  seller: string;
};
