"use client";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import ProductCard from "@/components/product-card/product-card";
import { useContractContext } from "@/contexts/contract-context";
import { useLocale } from "@/contexts/locale-context";
import { useWallet } from "@/contexts/wallet-context";
import { ProductType } from "@/types/product";
import { useEffect, useState } from "react";

export default function Home({ children }: { children: React.ReactNode }) {
  const { getLocaleString } = useLocale();
  const {
    contract,
    loading: contractLoading,
    getAllProducts,
  } = useContractContext();
  const { loading: walletLoading, provider } = useWallet();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (contract && provider && !walletLoading && !contractLoading) {
          const allProducts = await getAllProducts();
          setProducts(allProducts);
        } else {
          setProducts([]);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.code === "BAD_DATA" || err.code === "CALL_EXCEPTION") {
          console.log("Empty Products List");
        }
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [getAllProducts, contractLoading, walletLoading, provider, contract]);

  return (
    <main className="min-h-[85vh] bg-white rounded-2xl">
      <h2 className="items-center text-gray-700 text-2xl font-bold justify-center ">
        {getLocaleString("home.title")}
      </h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-black">
        {isLoading ? (
          <LoadingSpinner color="#AACC11" size={64} />
        ) : products && products.length > 0 ? (
          <>
            {products.map((product: ProductType) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </>
        ) : (
          <>{children}</>
        )}
      </div>
    </main>
  );
}
