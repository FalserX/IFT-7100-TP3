import { ProductType } from "@/types/product";
import {
  createProduct,
  updatePatchProduct,
  deleteProduct,
} from "@/libs/product-service";

type Props = {
  isOwner: boolean;
  productDataFn?: () => ProductType | null;
};

const SaveCancelDeleteProductSection = ({ isOwner, productDataFn }: Props) => {
  const handleSave = async () => {
    try {
      const productData: ProductType = productDataFn?.() ?? ({} as ProductType);
      if (!productData?.id) {
        throw new Error("Product ID is required for updating the product.");
      }
      const products = await fetch(`/api/products/${productData.id}`, {
        credentials: "include",
      });
      if (!products) {
        await createProduct(window.location.origin, productData);
      } else {
        await updatePatchProduct(
          productData.id,
          window.location.origin,
          productData
        );
      }
      window.location.reload();
    } catch (error) {
      throw new Error(`errors.users.user.profile.product.data.save. ${error}`);
    }
  };

  const handleDelete = async () => {
    const productData: ProductType = productDataFn?.() ?? ({} as ProductType);
    if (!productData.id) {
      throw new Error(`errors.users.user.profile.product.data.access`);
    }
    try {
      await deleteProduct(productData.id, window.location.origin);
      window.location.reload();
    } catch (error) {
      throw new Error(
        `errors.users.user.profile.product.data.delete. ${error}`
      );
    }
  };
  const handleCancel = async () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-row border-2 gap-2 rounded-2xl mt-2 border-gray-500 shadow-2xl shadow-gray-400">
      <div className="flex flex-row gap-64 ml-6 m-2">
        <button
          disabled={!isOwner}
          onClick={handleDelete}
          className="border rounded-2xl border-red-600 p-2 text-black shadow-2xl cursor-pointer hover:bg-red-600 hover:text-white"
        >
          {"users.user.profile.product.delete.btn.label"}
        </button>
        <button
          disabled={!isOwner}
          onClick={handleCancel}
          className="border rounded-2xl border-blue-500 p-2 text-black shadow-2xl cursor-pointer hover:bg-gray-300"
        >
          {"users.user.profile.product.cancel.btn.label"}
        </button>
        <button
          disabled={!isOwner}
          onClick={handleSave}
          className="border rounded-2xl p-2 bg-blue-500 border-white text-white cursor-pointer shadow-2xl hover:bg-blue-700 hover:text-white"
        >
          {"users.user.profile.product.save.btn.label"}
        </button>
      </div>
    </div>
  );
};

export default SaveCancelDeleteProductSection;
