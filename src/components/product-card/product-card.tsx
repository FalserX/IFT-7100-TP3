"use client";

import { useCart } from "@/contexts/cart-context";
import { ProductType } from "@/types/product";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addToCart } = useCart();
  console.log(product);
  return (
    <div className="rounded-xl p-4 border shadow flex flex-col">
      <h4 className="text-xl flex flex-col">{product.name}</h4>
      <div className="flex flex-col gap-2">
        <span className="flex flex-row gap-2">
          <p>{`products.product.description`}</p>
          {product.description}
        </span>
        <span className="flex flex-row gap-2">
          <p>{`products.product.price`}</p>
          {product.price} ETH
        </span>
        <span className="flex flex-row gap-2">
          <p>{`products.product.stock`}</p>
          {product.stock}
        </span>
        <span className="flex flex-row gap-2">
          <p>{`products.product.seller`}</p>
          {product.seller}
        </span>
      </div>
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded justify-center items-center hover:bg-blue-800 hover:underline hover:cursor-pointer"
        onClick={() => addToCart(product)}
      >
        {"cart.add.btn.label"}
      </button>
    </div>
  );
};

export default ProductCard;
