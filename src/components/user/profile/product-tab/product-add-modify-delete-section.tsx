import { useContractContext } from "@/contexts/contract-context";
import { useToast } from "@/contexts/toast-notification-context";
import { NotifType } from "@/types/notification";
import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocale } from "@/contexts/locale-context";
const ProductAddModifyDeleteSection = ({
  productId,
}: {
  productId: string | null;
}) => {
  const { getLocaleString } = useLocale();
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0.0);
  const [productStock, setProductStock] = useState<number>(0);
  const { showToast } = useToast();
  const { contract } = useContractContext();

  useEffect(() => {
    const fetchProduct = async (productId: string | null) => {
      if (!productId) {
        return;
      }
      if (!contract) {
        console.log("Contract not initialized");
        return;
      }
      const product = await contract.getProduct(productId);
      if (product) {
        setProductName(product.name);
        setProductDescription(product.description);
        setProductPrice(Number(ethers.formatEther(product.price)));
        setProductStock(product.stock);
      }
    };
    fetchProduct(productId);
  }, [productId, contract]);

  const handleProductNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setProductName(value);
    } catch (err) {
      console.log("handleProductNameChange error : ", err);
    }
  };
  const handleProductDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      const value = e.target.value;
      setProductDescription(value);
    } catch (err) {
      console.log("handleProductDescriptionChange error : ", err);
    }
  };
  const handleProductPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      if (!isNaN(parseFloat(value))) {
        setProductPrice(parseFloat(value));
      }
    } catch (err) {
      console.log("handleProductPriceChange error : ", err);
    }
  };
  const handleProductStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      if (!isNaN(parseInt(value))) {
        setProductStock(parseInt(value));
      }
    } catch (err) {
      console.log("handleProductStockChange : ", err);
    }
  };

  const handleCancel = async () => {
    window.location.reload();
  };
  const handleSave = async () => {
    try {
      if (!contract) {
        console.log("Contract not initialized");
        throw new Error("Contract not initialized");
      }

      const priceWei = ethers.parseEther(productPrice.toString());

      let tx;
      if (productId) {
        tx = await contract.updateProduct(
          productId,
          productName,
          productDescription,
          priceWei,
          productStock,
          true
        );
      } else {
        tx = await contract.addProduct(
          productName,
          productDescription,
          priceWei,
          productStock
        );
      }
      await tx.wait();
      showToast(
        "users.user.products.product.add.success",
        NotifType.CONFIRM,
        3000
      );
      window.location.reload();
    } catch (error) {
      showToast(
        "errors.users.user.products.product.add",
        NotifType.ERROR,
        3000
      );
      throw new Error(
        `${getLocaleString(
          "errors.users.user.profile.product.data.save"
        )} ${error}`
      );
    }
  };

  return (
    <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <h3 className="mt-2 ml-2 font-bold text-gray-600">
        {getLocaleString("users.user.profile.product.add.title")}
      </h3>
      <div className="flex flex-row m-2">
        <table
          id="productAddSection"
          className="w-[40vw] text-black m-2 table-auto border-spacing-10"
        >
          <tbody>
            <tr>
              <td>
                <label htmlFor="productName">
                  {getLocaleString("users.user.profile.product.add.name")}
                </label>
              </td>
              <td className="px-4 py-2">
                <input
                  required
                  type="text"
                  name="productName"
                  id="productName"
                  value={productName}
                  onChange={handleProductNameChange}
                  className={`rounded-xl border pl-2 border-gray-500 bg-white"`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productDescription">
                  {getLocaleString(
                    "users.user.profile.product.add.description"
                  )}
                </label>
              </td>
              <td className="px-4 py-2">
                <textarea
                  required
                  name="productDescription"
                  id="productDescription"
                  value={productDescription}
                  onChange={handleProductDescriptionChange}
                  className={`rounded-xl border pl-2 border-gray-500 bg-white`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productPrice">
                  {`${getLocaleString(
                    "users.user.profile.product.add.price"
                  )} ETH `}
                </label>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  required
                  name="productPrice"
                  id="productPrice"
                  value={productPrice}
                  onChange={handleProductPriceChange}
                  className={`rounded-xl border pl-2 border-gray-500 bg-white`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productStock">
                  {getLocaleString("users.user.profile.product.add.stock")}
                </label>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  required
                  name="productStock"
                  id="productStock"
                  value={productStock}
                  onChange={handleProductStockChange}
                  className={`rounded-xl border pl-2 border-gray-500 bg-white`}
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="table-row ">
              <td className="px-4 py-2">
                <button
                  onClick={handleCancel}
                  className="border rounded-2xl border-gray-600 p-2 text-black shadow-2xl cursor-pointer hover:bg-gray-600 hover:text-white"
                >
                  {getLocaleString(
                    "users.user.profile.product.add.btn.cancel.label"
                  )}
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={handleSave}
                  className="border rounded-2xl p-2 bg-blue-500 border-white text-white cursor-pointer shadow-2xl hover:bg-blue-700 hover:text-white"
                >
                  {getLocaleString("users.user.profile.product.btn.save.label")}
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
export default ProductAddModifyDeleteSection;
