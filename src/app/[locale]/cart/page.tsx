"use client";
import { Cart } from "@/types/cart";
import { v4 as uuid } from "uuid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import { useLocale } from "@/contexts/locale-context";
import { useAppUI } from "@/contexts/app-ui-context";
import { PopupType } from "@/types/popup";

type CartProductListProps = {
  cart: Cart;
  changeProductQtycart: (productId: typeof uuid, newQty: number) => void;
  removeProductcart: (productId: typeof uuid) => void;
};

const CartProductList = ({
  cart,
  changeProductQtycart,
  removeProductcart,
}: CartProductListProps) => {
  const { getLocaleString } = useLocale();
  const {
    setPopupActive,
    setPopupCancelAction,
    setPopupAction,
    setPopupTitle,
    setPopupMessage,
    setPopupType,
  } = useAppUI();

  const handleRemoveProductClick = (productId: typeof uuid) => {
    setPopupType?.(PopupType.CONFIRM);
    setPopupActive?.(true);
    setPopupMessage?.(`cart.products.remove-popup-msg`);
    setPopupTitle?.(`cart.products.remove-popup-title`);
    setPopupCancelAction?.(() => {
      setPopupActive?.(false);
    });
    setPopupAction?.(() => {
      setPopupActive?.(false);
      removeProductcart(productId);
    });
  };

  return (
    <div className="min-h-screen min-w-screen overflow-y-auto relative bg-gray-800">
      {cart.products.length > 0 ? (
        <table className="table-auto border-collapse w-full ">
          <colgroup>
            <col className="w-1/6" />
            <col className="w-1/3" />
            <col className="w-1/12" />
            <col className="w-1/6" />
            <col className="w-1/12" />
            <col />
          </colgroup>
          <thead className="sticky top-0 shadow bg-gray-700 z-10">
            <tr>
              <th>{getLocaleString("cart.products.name")}</th>
              <th>{getLocaleString("cart.products.merchant")}</th>
              <th>{getLocaleString("cart.products.unit-cost")} (ETH)</th>
              <th>{getLocaleString("cart.products.qty")}</th>
              <th>{getLocaleString("cart.products.cost")} (ETH)</th>
              <th>{getLocaleString("cart.products.action")}</th>
            </tr>
          </thead>
          <tbody>
            {cart.products.map((val) => {
              return (
                <tr key={val.id} className="border-b-2 border-white">
                  <td className="items-center justify-center text-center">
                    {val.name}
                  </td>
                  <td className="items-center justify-center text-center">
                    {val.merchant.name}
                  </td>
                  <td className="items-center justify-center text-center">
                    {val.cost}
                  </td>
                  <td className="items-center justify-center text-center">
                    <button
                      className="rounded-4xl border-white border-2 mr-2 group relative hover:bg-blue-400"
                      onClick={() => {
                        changeProductQtycart(val.id, val.qty - 1);
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        alt={getLocaleString("cart.products.qty-btn-minus-alt")}
                        src="/Minus.svg"
                      />
                      <span
                        className={`absolute left-0 bottom-full w-[800%] z-10 transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {getLocaleString("cart.products.qty-btn-minus-tooltip")}
                      </span>
                    </button>
                    <input
                      type="text"
                      min={1}
                      onChange={(evt) => {
                        const newQty = parseInt(evt.target.value, 10);
                        if (!isNaN(newQty) && newQty > 0) {
                          changeProductQtycart(val.id, newQty);
                        }
                      }}
                      value={val.qty}
                      className={`text-center justify-center items-center bg-white text-black rounded-2xl w-2/5`}
                    />
                    <button
                      className="rounded-4xl border-white border-2 ml-2 group relative hover:bg-blue-400"
                      onClick={() => {
                        changeProductQtycart(val.id, val.qty + 1);
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        alt={getLocaleString("cart.products.qty-btn-plus-alt")}
                        src="/Plus.svg"
                      />
                      <span
                        className={`absolute left-0 bottom-full w-[800%] z-10 transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {getLocaleString("cart.products.qty-btn-plus-tooltip")}
                      </span>
                    </button>
                  </td>
                  <td className="items-center justify-center text-center">
                    {val.qty * val.cost}
                  </td>
                  <td className="items-center justify-center text-center flex">
                    <div className="inline-flex min-w-fit min-h-fit relative group border-2 border-red-800 hover:border-red-950 items-center justify-center text-center bg-red-500 hover:bg-red-950 rounded-2xl px-4 py-2 my-2">
                      <Image
                        width={20}
                        height={20}
                        alt={getLocaleString("cart.products.remove-btn-alt")}
                        src={"/Trashcan.svg"}
                        className="mr-2"
                      />
                      <button
                        className="hover:underline hover:font-bold"
                        onClick={() => {
                          handleRemoveProductClick(val.id);
                        }}
                      >
                        {getLocaleString("cart.products.remove-btn-label")}
                      </button>
                      <span
                        className={`absolute right-full w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {getLocaleString("cart.products.remove-btn-tooltip")}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table className="min-h-screen min-w-screen">
          <tbody className="min-w-screen min-h-screen">
            <tr className="flex min-w-screen min-h-screen items-center justify-center text-center">
              <td className="flex flex-col items-center justify-center text-center">
                <>
                  <Image
                    width={64}
                    height={64}
                    src="/Emptycart.svg"
                    className={"opacity-25 mr-4"}
                    alt={getLocaleString("cart.products.empty-cart-icon")}
                  />
                  <span className={"opacity-25"}>
                    {getLocaleString("errors.cart.product.empty")}
                  </span>
                  <Link
                    href={"/"}
                    className=" flex underline hover:font-bold opacity-100"
                  >
                    {getLocaleString("cart.products.empty-cart-btn-label")}
                  </Link>
                </>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

const CartPage = () => {
  const hasInit = useRef(false);
  const { cart, setCart } = useCart();
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const { LoadingSpinner } = useAppUI();

  const changeProductQtyCart = useCallback(
    (productId: typeof uuid, newQty: number) => {
      setCart((prev) => {
        const updatedProducts = prev.products
          .map((prod) =>
            prod.id === productId ? { ...prod, qty: newQty } : prod
          )
          .filter((prod) => prod.qty > 0);
        if (JSON.stringify(prev.products) === JSON.stringify(updatedProducts)) {
          return prev;
        }
        return { ...prev, products: updatedProducts };
      });
    },
    [setCart]
  );
  const removeProductCart = useCallback(
    (productId: typeof uuid) => {
      setCart((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
      }));
    },
    [setCart]
  );

  useEffect(() => {
    if (!hasInit.current && cart.products.length === 0) {
      const product: Product = {
        cost: 2,
        merchant: { name: "ddd", address: "dcfswfw" },
        id: uuid(),
        name: "Bananes",
        qty: 2,
      };
      setCart((prev) => {
        const exists = prev.products.find((p) => p.id === product.id);
        if (exists) {
          return prev;
        }
        return { ...prev, products: [...prev.products, product] };
      });
      hasInit.current = true;
    }
    setLoadingCart(false);
  }, [setCart, cart.products.length]);

  const { getLocaleString } = useLocale();

  return (
    <main className="min-h-[85vh] bg-white rounded-md">
      <h2 className="items-center text-white font-bold justify-center text-center bg-gray-500 border-2 border-black rounded-md">
        {getLocaleString("cart.title")}
      </h2>
      {cart && !loadingCart ? (
        <CartProductList
          cart={cart}
          changeProductQtycart={changeProductQtyCart}
          removeProductcart={removeProductCart}
        />
      ) : (
        LoadingSpinner && <LoadingSpinner size={30} />
      )}
    </main>
  );
};

export default CartPage;
