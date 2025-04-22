import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { ProductType } from "@/types/product";
import { useEffect, useState } from "react";

const ProductListSection = ({
  userId,
  onEdit,
  onDelete,
}: {
  userId: string;
  onEdit: (product: ProductType) => void;
  onDelete: (productId: string) => void;
}) => {
  const [productList, setProductList] = useState<ProductType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async (userId: string) => {
      try {
        const response = await fetch(`/api/products?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Cannot get the products for the user`);
        }
        const products = await response.json();
        const productsData: { success: boolean; data: ProductType[] } =
          products.data;
        if (!productsData.success) {
          setProductList([]);
          return;
        }
        setProductList(productsData.data);
      } catch (err) {
        console.error(`API Error: ${err}`);
        setProductList([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchProducts(userId);
  }, [userId]);

  return (
    <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <h3 className="mt-2 ml-2 font-bold text-gray-600">
        {"users.user.profile.product.list.title"}
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
                    {"users.user.profile.product.list.actions"}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {"users.user.profile.product.list.name"}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {"users.user.profile.product.list.description"}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {"users.user.profile.product.list.price ETH"}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {"users.user.profile.product.list.stock"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center rounded-2xl">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-500 hover:underline mr-2"
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
                      {product.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="text-gray-500 text-sm italic mt-4">
            {"errors.users.user.profile.products.found"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductListSection;
