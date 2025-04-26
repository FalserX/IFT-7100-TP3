import ProfilePageBodyNav from "./profile-page-body-nav";
import { AnimatePresence, motion } from "framer-motion";
import GeneralTab from "../../general-tab/general-tab";
import CartTab from "../../cart-tab/cart-tab";
import ProductTab from "../../product-tab/product-tab";
import OrderTab from "../../order-tab/order-tab";
import { useLocale } from "@/contexts/locale-context";
const tabComponentMap: Record<string, React.FC> = {
  general: () => <GeneralTab />,
  cart: () => <CartTab />,
  products: () => <ProductTab />,
  order: () => <OrderTab />,
};

const ProfilePageBody = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { getLocaleString } = useLocale();
  return (
    <>
      <ProfilePageBodyNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow p-6 min-h-full"
          >
            {(() => {
              const Component = tabComponentMap[activeTab];
              if (!Component)
                return (
                  <p className="text-black">
                    {getLocaleString("errors.users.user.profile.tab")}
                  </p>
                );
              return <Component />;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProfilePageBody;
