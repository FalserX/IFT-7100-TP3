import ProfileTabHeader from "../profile-tab-header";
import CartSection from "./cart-section";

const CartTab = () => {
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle="users.user.profile.cart.title"
      />
      <CartSection />
    </div>
  );
};

export default CartTab;
