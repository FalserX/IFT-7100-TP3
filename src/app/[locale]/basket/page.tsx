"use client";
import { Basket } from "@/types/basket";
import { v4 as uuid } from "uuid";
import renderTranslate from "@/utils/renderTranslate";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading/loading";
import Image from "next/image";
import {
  addProductBasket,
  getBasket,
  removeProductBasket,
} from "@/services/basket";
import { Product } from "@/types/product";

const BasketProductList = ({
  basket,
  currentLocale,
  loadingFallback = (
    <Loading
      className="w-[1rem] h-[1rem] my-1 items-center"
      spinnerColor="#FFF"
    />
  ),
}: {
  basket: Basket;
  currentLocale: string;
  loadingFallback?: React.ReactNode;
}) => {
  const [productNameHeader, setProductNameHeader] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productCostUnitHeader, setProductCostUnitHeader] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productMerchantHeader, setProductMerchantHeader] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productQtyHeader, setProductQtyHeader] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productCostHeader, setProductCostHeader] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productRemoveBtnLabel, setProductRemoveBtnLabel] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productRemoveBtnAlt, setProductRemoveBtnAlt] = useState<string>("");
  const [productRemoveBtnTooltip, setProductRemoveBtnTooltip] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productActionHeader, setProductActionHeader] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productQtyBtnMinusTooltip, setProductQtyBtnMinusTooltip] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productQtyBtnPlusTooltip, setProductQtyBtnPlusTooltip] = useState<
    string | React.ReactNode
  >(loadingFallback);
  const [productQtyBtnMinusAlt, setProductQtyBtnMinusAlt] =
    useState<string>("");
  const [productQtyBtnPlusAlt, setProductQtyBtnPlusAlt] = useState<string>("");

  useEffect(() => {
    const getFetchTranslation = async (locale: string, text: string) => {
      return await renderTranslate(text, locale);
    };
    getFetchTranslation(currentLocale, "basket.products.name").then((res) => {
      setProductNameHeader(res);
    });
    getFetchTranslation(currentLocale, "basket.products.merchant").then(
      (res) => {
        setProductMerchantHeader(res);
      }
    );
    getFetchTranslation(currentLocale, "basket.products.unit-cost").then(
      (res) => {
        setProductCostUnitHeader(res);
      }
    );
    getFetchTranslation(currentLocale, "basket.products.qty").then((res) => {
      setProductQtyHeader(res);
    });
    getFetchTranslation(currentLocale, "basket.products.cost").then((res) => {
      setProductCostHeader(res);
    });
    getFetchTranslation(currentLocale, "basket.products.remove-btn-label").then(
      (res) => {
        setProductRemoveBtnLabel(res);
      }
    );
    getFetchTranslation(currentLocale, "basket.products.remove-btn-alt").then(
      (res) => {
        setProductRemoveBtnAlt(res);
      }
    );
    getFetchTranslation(
      currentLocale,
      "basket.products.remove-btn-tooltip"
    ).then((res) => {
      setProductRemoveBtnTooltip(res);
    });
    getFetchTranslation(currentLocale, "basket.products.action").then((res) => {
      setProductActionHeader(res);
    });
    getFetchTranslation(
      currentLocale,
      "basket.products.qty-btn-minus-tooltip"
    ).then((res) => {
      setProductQtyBtnMinusTooltip(res);
    });
    getFetchTranslation(
      currentLocale,
      "basket.products.qty-btn-plus-tooltip"
    ).then((res) => {
      setProductQtyBtnPlusTooltip(res);
    });
    getFetchTranslation(currentLocale, "basket.products.qty-btn-plus-alt").then(
      (res) => {
        setProductQtyBtnPlusAlt(res);
      }
    );
    getFetchTranslation(
      currentLocale,
      "basket.products.qty-btn-minus-alt"
    ).then((res) => {
      setProductQtyBtnMinusAlt(res);
    });
  }, [currentLocale]);
  const [products, setProducts] = useState<Product[]>(basket.products);
  return (
    <div className="max-h-fit overflow-y-auto relative bg-gray-800">
      {products.length > 0 ? (
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
              <th>{productNameHeader}</th>
              <th>{productMerchantHeader}</th>
              <th>{productCostUnitHeader} (ETH)</th>
              <th>{productQtyHeader}</th>
              <th>{productCostHeader} (ETH)</th>
              <th>{productActionHeader}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((val) => {
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
                        removeProductBasket(val, val.qty--);
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        alt={productQtyBtnMinusAlt}
                        src="/Minus.svg"
                      />
                      <span
                        className={`absolute left-0 bottom-full w-[800%] z-10 transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {productQtyBtnMinusTooltip}
                      </span>
                    </button>
                    <input
                      type="text"
                      min={1}
                      onChange={(evt) => {
                        const newQty = parseInt(evt.target.value, 10);
                        if (!isNaN(newQty) && newQty > 0) {
                          const updatedProducts = basket.products.map((p) => {
                            return p.id === val.id ? { ...p, qty: newQty } : p;
                          });
                          setProducts(updatedProducts);
                        }
                      }}
                      id={val.id + "_qty"}
                      value={val.qty}
                      className={`text-center justify-center items-center bg-white text-black rounded-2xl w-2/5`}
                    />
                    <button
                      className="rounded-4xl border-white border-2 ml-2 group relative hover:bg-blue-400"
                      onClick={() => {
                        addProductBasket(val, val.qty++);
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        alt={productQtyBtnPlusAlt}
                        src="/Plus.svg"
                      />
                      <span
                        className={`absolute left-0 bottom-full w-[800%] z-10 transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {productQtyBtnPlusTooltip}
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
                        alt={productRemoveBtnAlt}
                        src={"/Trashcan.svg"}
                        className="mr-2"
                      />
                      <button
                        className="hover:underline hover:font-bold"
                        onClick={() => {
                          removeProductBasket(val);
                        }}
                      >
                        {productRemoveBtnLabel}
                      </button>
                      <span
                        className={`absolute right-full w-full transform translate-y-2 mb-2 px-2 py-1 text-xs text-white bg-orange-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {productRemoveBtnTooltip}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table>
          <tbody>
            <tr>
              <td>Vide</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

const BasketPage = ({
  currentLocale,
  loadingFallback = (
    <Loading
      className="w-[1rem] h-[1rem] my-1 items-center"
      spinnerColor="#FFF"
    />
  ),
}: {
  currentLocale: string;
  loadingFallback?: React.ReactNode;
}) => {
  const [basketTitle, setBasketTitle] = useState<string | null>();
  const [basket, setBasket] = useState<Basket | undefined>();
  const [loadingBasket, setLoadingBasket] = useState<boolean>(true);
  useEffect(() => {
    const currentBasket = getBasket();
    if (!currentBasket || currentBasket.products.length == 0) {
      const product: Product = {
        cost: 2,
        merchant: { name: "ddd", address: "dcfswfw" },
        id: uuid(),
        name: "Bananes",
        qty: 2,
      };
      addProductBasket(product, 2);
    }
    setBasket(getBasket());
    setLoadingBasket(false);
  }, []);
  useEffect(() => {
    const getFetchTranslation = async (locale: string, text: string) => {
      return await renderTranslate(text, locale);
    };
    getFetchTranslation(currentLocale, "basket.title").then((res) => {
      setBasketTitle(res);
    });
  }, [currentLocale]);

  return (
    <main className="min-h-[85vh] bg-white rounded-md">
      <h2 className="items-center text-white font-bold justify-center text-center bg-gray-500 border-2 border-black rounded-md">
        {!basketTitle ? loadingFallback : basketTitle}
      </h2>
      {basket && !loadingBasket ? (
        <BasketProductList currentLocale={currentLocale} basket={basket} />
      ) : (
        loadingFallback
      )}
    </main>
  );
};

export default BasketPage;
