import ProfileTabHeader from "../profile-tab-header";
import CartSection from "./cart-section";
import { useLocale } from "@/contexts/locale-context";
const CartTab = () => {
  const { getLocaleString } = useLocale();
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle={getLocaleString("users.user.profile.cart.title")}
      />
      <CartSection />
    </div>
  );
};

export default CartTab;
