import ProfileTabHeader from "../profile-tab-header";
import OrderSection from "./order-section";
import { useLocale } from "@/contexts/locale-context";
const OrderTab = () => {
  const { getLocaleString } = useLocale();
  return (
    <div>
      <ProfileTabHeader
        activeBanner={false}
        headerTitle={getLocaleString("users.user.profile.order.title")}
      />
      <OrderSection />
    </div>
  );
};

export default OrderTab;
