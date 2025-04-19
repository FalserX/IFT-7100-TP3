import { createContext, useContext, useState } from "react";
import { Cart } from "@/types/cart";

const cartContext = createContext<{
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
} | null>(null);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<Cart>({ products: [] });
  return (
    <cartContext.Provider value={{ cart, setCart }}>
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("usecart must be used within cartProvider");
  }
  return context;
};
