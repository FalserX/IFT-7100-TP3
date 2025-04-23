import { useState } from "react";
import ProfileTabHeader from "../profile-tab-header";
import ProductAddModifyDeleteSection from "./product-add-modify-delete-section";
import ProductListSection from "./product-list-section";

const ProductTab = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.product.title"
      />
      <ProductListSection setSelectedProductId={setSelectedProductId} />
      <ProductAddModifyDeleteSection productId={selectedProductId} />
    </div>
  );
};

export default ProductTab;
