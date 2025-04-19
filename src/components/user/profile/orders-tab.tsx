import { OrderType } from "@/types/order";
import { UserAdminView, UserOwnerView } from "@/types/user";

const OrdersTab = ({ profile }: { profile: UserAdminView | UserOwnerView }) => {
  return (
    <div>
      <h2>{"users.user.profile.orders"}</h2>
      {"ordersList" in profile &&
        Array.isArray(profile.ordersList) &&
        profile.ordersList.map((order: OrderType) => {
          return <p key={order.id}>{order.name}</p>;
        })}
    </div>
  );
};

export default OrdersTab;
