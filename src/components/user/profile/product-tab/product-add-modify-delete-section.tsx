import { ProductType } from "@/types/product";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ImageType } from "@/types/image";
import Image from "next/image";
import { v4 as uuid } from "uuid";

type Props = {
  isOwner: boolean;
  userId: string;
  isModify: boolean;
};
type ProductAddModifyDeleteSectionRef = {
  getData: () => ProductType | null;
  setData: (product: ProductType) => void;
};

const ProductAddModifyDeleteSection = forwardRef<
  ProductAddModifyDeleteSectionRef,
  Props
>(({ isOwner, userId, isModify }, ref) => {
  const [productId, setProductID] = useState<string>(uuid());
  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);
  const [productDelete, setProductDelete] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [selectedProductImage, setSelectedProductImage] = useState<
    ImageType | undefined
  >();
  const [previewProductImageUrl, setPreviewProductImageUrl] = useState<
    string | undefined
  >();
  const [previewProductImage, setPreviewProductImage] = useState<
    ImageType | File | undefined
  >(selectedProductImage);
  const [productStock, setProductStock] = useState<number>(0);
  const [productCost, setProductCost] = useState<number>(0);
  const [productDescription, setProductDescription] = useState<
    string | undefined
  >(undefined);
  useEffect(() => {
    return () => {
      if (
        previewProductImageUrl &&
        previewProductImageUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewProductImageUrl);
      }
    };
  }, [previewProductImageUrl]);
  useImperativeHandle(ref, () => ({
    getData: (): ProductType | null => {
      const now = new Date().toISOString();
      setCreatedAt(now);
      if (
        !productName.trim() ||
        !productDescription ||
        !productDescription.trim() ||
        productCost < 0 ||
        productStock < 0
      ) {
        return null;
      }
      return {
        id: productId,
        name: productName,
        description: productDescription,
        price: productCost,
        stock: productStock,
        delete: productDelete,
        createdAt: isModify && createdAt ? createdAt : now,
        userId: userId,
        updatedAt: now,
      };
    },
    setData: (newProduct: ProductType) => {
      setProductID(newProduct.id);
      setProductCost(newProduct.price);
      setProductDelete(newProduct.delete);
      setProductDescription(newProduct.description);
      setProductName(newProduct.name);
      setProductStock(newProduct.stock);
      setSelectedProductImage(newProduct.image);
    },
  }));
  const handleProductImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file: File | null = event.target.files?.[0] || null;
    if (file) {
      setPreviewProductImage(file);
      setPreviewProductImageUrl(URL.createObjectURL(file));
    }
  };
  const handleProductImageRevoke = (): void => {
    if (previewProductImageUrl?.startsWith("blob:")) {
      setPreviewProductImage(selectedProductImage);
      URL.revokeObjectURL(previewProductImageUrl ?? "");
      setPreviewProductImageUrl(undefined);
    }
  };
  const handleProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setProductName(event.target.value);
  };

  const handleProductDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setProductDescription(event.target.value);
  };
  const handleProductPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const result = Number(event.target.value);
    if (!isNaN(result)) setProductCost(result);
  };
  const handleProductStockChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const result = Number(event.target.value);
    if (!isNaN(result)) setProductStock(result);
  };
  return (
    <div className="flex flex-col border-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <h3 className="mt-2 ml-2 font-bold text-gray-600">
        {"users.user.profile.product.add.title"}
      </h3>
      <div className="flex flex-row m-2">
        <table
          id="productAddSection"
          className="w-[40vw] text-black m-2 table-auto border-spacing-4"
        >
          <tbody>
            <tr>
              <td>
                <label htmlFor="productName">
                  {"users.user.profile.product.add.name"}
                </label>
              </td>
              <td className="px-4 py-2">
                <input
                  required
                  type="text"
                  name="productName"
                  id="productName"
                  disabled={!isOwner}
                  value={productName}
                  onChange={handleProductNameChange}
                  className={`rounded-xl border pl-2 border-gray-500 ${
                    isOwner ? "bg-white" : "bg-gray-300"
                  }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productDescription">
                  {"users.user.profile.product.add.description"}
                </label>
              </td>
              <td className="px-4 py-2">
                <textarea
                  required
                  name="productDescription"
                  id="productDescription"
                  disabled={!isOwner}
                  value={productDescription}
                  onChange={handleProductDescriptionChange}
                  className={`rounded-xl border pl-2 border-gray-500 ${
                    isOwner ? "bg-white" : "bg-gray-300"
                  }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productPrice">
                  {"users.user.profile.product.add.price"}
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
                  disabled={!isOwner}
                  value={productCost}
                  onChange={handleProductPriceChange}
                  className={`rounded-xl border pl-2 border-gray-500 ${
                    isOwner ? "bg-white" : "bg-gray-300"
                  }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productStock">
                  {"users.user.profile.product.add.stock"}
                </label>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  required
                  name="productStock"
                  id="productStock"
                  disabled={!isOwner}
                  value={productStock}
                  onChange={handleProductStockChange}
                  className={`rounded-xl border pl-2 border-gray-500 ${
                    isOwner ? "bg-white" : "bg-gray-300"
                  }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="productImage">
                  {"users.user.profile.product.add.image"}
                </label>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2">
                <div className="flex flex-row items-center justify-center">
                  {previewProductImageUrl ? (
                    <Image
                      src={previewProductImageUrl}
                      alt={"users.user.profile.product.add.image.preview"}
                      width={32}
                      height={32}
                      className={"bg-gray-900 p-5 m-2 mt-8 w-[100px] h-[100px]"}
                    />
                  ) : (
                    <div className="w-[64px] h-[64px] border border-gray-600 mr-3"></div>
                  )}
                  <input
                    id="fileProductImageChange"
                    name="fileProductImageChange"
                    type="file"
                    className="hidden"
                    onClick={(e) => (e.currentTarget.value = "")}
                    onChange={handleProductImageChange}
                  />
                  <div className="flex flex-col gap-2 items-center justify-center align-middle">
                    <button
                      disabled={!isOwner}
                      id="changeProductImage"
                      name="changeProductImage"
                      className={`h-[50px] ${
                        isOwner
                          ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                          : "border-gray-500 text-gray-500"
                      } bg-white border-2 px-4 py-1 rounded-lg mr-4`}
                      onClick={() => {
                        if (isOwner) {
                          document
                            .getElementById("fileProductImageChange")
                            ?.click();
                        }
                      }}
                    >
                      {"users.user.profile.product.add.image.preview.change"}
                    </button>
                    {previewProductImageUrl && (
                      <button
                        disabled={!isOwner}
                        id="removeProductImagePrev"
                        name="removeProductImagePrev"
                        className={`h-[50px] ${
                          isOwner
                            ? "border-blue-500 text-blue-500 cursor-pointer hover:bg-gray-300"
                            : "border-gray-500 text-gray-500"
                        } bg-white border-2 px-4 py-1 rounded-lg mr-4`}
                        onClick={isOwner ? handleProductImageRevoke : () => {}}
                      >
                        {"users.user.profile.product.add.image.preview.remove"}
                      </button>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});
ProductAddModifyDeleteSection.displayName = "ProductAddModifyDeleteSection";
export default ProductAddModifyDeleteSection;
