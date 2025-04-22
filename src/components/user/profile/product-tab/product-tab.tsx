import { RoleType } from "@/types/role";
import { UserAdminView, UserOwnerView } from "@/types/user";
import ProfileTabHeader from "../profile-tab-header";
import ProductListSection from "./product-list-section";
import ProductAddModifyDeleteSection from "./product-add-modify-delete-section";
import { useRef, useState } from "react";
import { ProductType } from "@/types/product";
import SaveCancelDeleteProductSection from "./save-cancel-delete-product-section";
import { deleteProduct } from "@/libs/product-service";

type Props = {
  currentUser: { id: string; role: RoleType[] };
  profile: UserAdminView | UserOwnerView;
};

const ProductTab = ({ currentUser, profile }: Props) => {
  const [isModify, setIsModify] = useState<boolean>(false);
  const productAddModifyDeleteRef = useRef<{
    getData: () => ProductType | null;
    setData: (product: ProductType) => void;
  }>(null);
  const handleEditProduct = (product: ProductType) => {
    setIsModify(true);
    productAddModifyDeleteRef.current?.setData(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) {
      console.error("No Product Id selected");
      return;
    }

    try {
      await deleteProduct(productId, window.location.origin);
      window.location.reload();
    } catch (err) {
      console.error(`API error: ${err}`);
    }
  };
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.product.title"
      />
      <ProductListSection
        userId={currentUser.id}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
      {currentUser.id && (
        <>
          <ProductAddModifyDeleteSection
            ref={productAddModifyDeleteRef}
            isOwner={currentUser.id === profile.id}
            userId={currentUser.id}
            isModify={isModify}
          />
          <SaveCancelDeleteProductSection
            productDataFn={() =>
              productAddModifyDeleteRef.current?.getData() || null
            }
            isOwner={currentUser.id === profile.id}
          />
        </>
      )}
    </div>
  );
};

export default ProductTab;
