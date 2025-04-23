import { useCart } from "@/contexts/cart-context";
import React from "react";
import Image from "next/image";
const CartSection = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    getSubTotalFromCart,
    getTotalFromCart,
    increaseQty,
    decreaseQty,
    setQty,
    buyCart,
  } = useCart();
  return (
    <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <h3 className="mt-2 ml-2 font-bold text-gray-600">
        {"users.user.cart.title"}
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-end items-end align-middle mr-3">
          <button
            disabled={cart.length === 0}
            className={`${
              cart.length === 0
                ? "text-gray-500"
                : "text-blue-500 hover:underline"
            } mr-2`}
            onClick={clearCart}
          >
            {"users.user.cart.clear"}
          </button>
          <button
            disabled={cart.length === 0}
            className={`border rounded-2xl mr-2 mt-2 shadow-2xl p-2 ${
              cart.length === 0
                ? "text-gray-500 bg-gray-300 border-white"
                : "cursor-pointer bg-blue-500 border-white text-white hover:bg-gray-300 hover:text-black"
            }`}
            onClick={cart.length > 0 ? buyCart : () => {}}
          >
            {"users.user.cart.buy"}
          </button>
          <span className="font-semibold text-gray-700">
            <span>{`users.user.cart.total : `}</span>
            {`${getTotalFromCart()} ETH`}
          </span>
        </div>
        <div>
          {cart.length === 0 ? (
            <span className="text-gray-500 text-sm italic mt-4 ml-5 mb-2">
              {"users.user.cart.empty"}
            </span>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y max-w-[1500px]">
              <table className="w-full table-auto border-collapse border border-gray-300 mt-4 rounded-xl shadow-md overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      {"users.user.cart.product.actions"}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      {"users.user.cart.product.name"}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      {"users.user.cart.product.description"}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      {"users.user.cart.product.price (ETH)"}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      {"users.user.cart.product.qty"}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      {"users.user.cart.product.subTotal"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-500">
                      <td className="border border-gray-300 px-4 py-2 text-center rounded-2xl">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-blue-500 hover:underline mr-2"
                        >
                          🗑️
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {product.price}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 gap-2 text-center flex flex-row">
                        <button
                          className="hover:cursor-pointer text-blue-500"
                          onClick={() => {
                            decreaseQty(product.id);
                          }}
                        >
                          <Image
                            alt={"users.user.cart.product.qty.decrease.btn.lbl"}
                            src={"/Minus.svg"}
                            width={16}
                            height={16}
                            className="brightness-0"
                          />
                        </button>
                        <input
                          type="number"
                          min={0}
                          onChange={(e) => {
                            setQty(
                              product.id,
                              !isNaN(Number.parseInt(e.target.value))
                                ? Number.parseInt(e.target.value)
                                : 1
                            );
                          }}
                          value={product.qty}
                          className="border border-gray-500 rounded-2xl text-center w-36"
                        />
                        <button
                          className="hover:cursor-pointer text-blue-500"
                          onClick={() => {
                            increaseQty(product.id);
                          }}
                        >
                          <Image
                            src={"/Plus.svg"}
                            className="brightness-0"
                            alt={"users.user.cart.product.qty.increase.btn.lbl"}
                            width={16}
                            height={16}
                          />
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {getSubTotalFromCart(product.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CartSection.displayName = "CartSection";

export default CartSection;
