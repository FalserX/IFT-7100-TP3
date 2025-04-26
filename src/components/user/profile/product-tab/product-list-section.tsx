import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { useContractContext } from "@/contexts/contract-context";
import { useToast } from "@/contexts/toast-notification-context";
import { useWallet } from "@/contexts/wallet-context";
import { NotifType } from "@/types/notification";
import { ProductType } from "@/types/product";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/contexts/locale-context";

const ProductListSection = ({
  setSelectedProductId,
}: {
  setSelectedProductId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { getLocaleString } = useLocale();
  const { contract } = useContractContext();
  const { address } = useWallet();
  const [productList, setProductList] = useState<ProductType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const onEdit = (productId: string) => {
    setSelectedProductId(productId);
  };
  const onDelete = useCallback(
    async (productId: string) => {
      try {
        if (!contract) {
          showToast(
            `errors.users.user.products.product.contract.error`,
            NotifType.ERROR
          );
          return;
        }
        const tx = await contract.removeProduct(productId);
        await tx.wait();
        showToast(`users.user.products.product.delete.success`);
      } catch (err) {
        showToast(
          `errors.users.user.products.product.delete.error ${err}`,
          NotifType.ERROR
        );
      }
    },
    [contract, showToast]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!contract || !address) {
          return;
        }
        const onChainProducts = await contract.getAllProductsByOwner(address);
        setProductList(onChainProducts);
      } catch (err) {
        console.log(`API Error: ${err}`);
        setProductList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [contract, address]);

  return (
    <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <h3 className="mt-2 ml-2 font-bold text-gray-600">
        {getLocaleString("users.user.profile.product.list.title")}
      </h3>
      <div className="flex flex-row m-2">
        {isLoading ? (
          <LoadingSpinner color="#AACC11" size={64} />
        ) : productList && productList.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y max-w-[1500px]">
            <table className="w-full table-auto border-collapse border border-gray-300 mt-4 rounded-xl shadow-md overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {getLocaleString("users.user.profile.product.list.actions")}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {getLocaleString("users.user.profile.product.list.name")}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {getLocaleString(
                      "users.user.profile.product.list.description"
                    )}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {`${getLocaleString(
                      "users.user.profile.product.list.price"
                    )} (ETH)`}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {getLocaleString("users.user.profile.product.list.stock")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-500">
                    <td className="border border-gray-300 px-4 py-2 text-center rounded-2xl">
                      <button
                        onClick={() => onEdit(product.id)}
                        className="text-blue-500 hover:underline mr-2 hover:cursor-pointer"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
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
                      {ethers.formatEther(product.price)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {Number(ethers.formatUnits(product.stock, 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="text-gray-500 text-sm italic mt-4">
            {getLocaleString("errors.users.user.profile.products.found")}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductListSection;
