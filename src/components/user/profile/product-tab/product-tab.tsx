import { useState } from "react";
import ProfileTabHeader from "../profile-tab-header";
import ProductAddModifyDeleteSection from "./product-add-modify-delete-section";
import ProductListSection from "./product-list-section";
import { useLocale } from "@/contexts/locale-context";
const ProductTab = () => {
  const { getLocaleString } = useLocale();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle={getLocaleString("users.user.profile.product.title")}
      />
      <ProductListSection setSelectedProductId={setSelectedProductId} />
      <ProductAddModifyDeleteSection productId={selectedProductId} />
    </div>
  );
};

export default ProductTab;
