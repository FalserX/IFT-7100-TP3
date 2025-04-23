import { useState, useEffect } from "react";
import { ProductType } from "../types/product";
import { NotifType } from "@/types/notification";
import { useToast } from "@/contexts/toast-notification-context";
import { getContract } from "@/libs/contract-service";
import { ethers } from "ethers";
import { useWallet } from "@/contexts/wallet-context";

const CART_KEY = "cart_products";

export const useCartLogic = () => {
  const { showToast } = useToast();
  const { address } = useWallet();
  const { getBalance } = useWallet();
  const [cart, setCart] = useState<ProductType[]>([]);
  const [balance, setBalance] = useState<string>();
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      const fetchedBalance = await getBalance();
      setBalance(fetchedBalance.toString());
    };
    fetchBalance();
  }, [getBalance]);
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const increaseQty = (productId: string) => {
    setCart((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, qty: (product.qty ?? 1) + 1 }
          : product
      )
    );
  };

  const decreaseQty = (productId: string) => {
    setCart((prev) =>
      prev
        .map((product) =>
          product.id === productId
            ? { ...product, qty: Math.max((product.qty ?? 1) - 1, 1) }
            : product
        )
        .filter((product) => (product.qty ?? 1) > 0)
    );
  };

  const setQty = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, qty: qty > 0 ? qty : 1 }
          : product
      )
    );
  };

  const addToCart = (product: ProductType) => {
    if (address) {
      const exist = cart.find((p) => p.id === product.id);
      if (!exist) {
        setCart((prev) => [...prev, { ...product, qty: 1 }]);
      } else {
        setCart((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, qty: (p.qty ?? 1) + 1 } : p
          )
        );
      }
      showToast("users.user.cart.products.product.add", NotifType.CONFIRM);
    } else {
      showToast(
        "errors.users.user.cart.products.product.connect",
        NotifType.ERROR
      );
    }
  };
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
    showToast("users.user.cart.products.product.remove", NotifType.CONFIRM);
  };

  const getSubTotalFromCart = (productId: string) => {
    const product = cart.find((product) => product.id == productId);
    return (product?.qty ?? 1) * (product?.price ?? 0);
  };
  const getTotalFromCart = () => {
    const total = cart.reduce((acc, product) => {
      const quantity = product.qty ?? 1;
      return acc + quantity * product.price;
    }, 0);
    return total;
  };

  const clearCart = () => {
    setCart([]);
    showToast("users.user.cart.products.remove", NotifType.CONFIRM);
  };

  const buyCart = async () => {
    let success = false;
    try {
      const contract = await getContract();
      if (!window.ethereum) {
        throw new Error("Ethereum provider is not available");
      }

      const totalPrice = ethers.parseEther(getTotalFromCart().toFixed(18));
      if (balance && ethers.parseUnits(balance, "ether") < totalPrice) {
        showToast(
          "users.user.cart.products.balance.insufficient",
          NotifType.ERROR,
          5000
        );
        return;
      }

      cart.forEach(async (product) => {
        const tx = await contract.purchaseProduct(product.id, product.qty ?? 1);
        await tx.wait();
        success = true;
      });
      if (success) {
        showToast(
          "users.user.cart.products.buy.success",
          NotifType.CONFIRM,
          3000
        );
        clearCart();
      }
    } catch (err) {
      success = false;
      showToast(
        `users.user.cart.products.buy.error ${String(err)} `,
        NotifType.ERROR,
        3000
      );
      console.log(err);
      return;
    }
  };

  return {
    cart,
    addToCart,
    clearCart,
    removeFromCart,
    getTotalFromCart,
    getSubTotalFromCart,
    increaseQty,
    decreaseQty,
    setQty,
    buyCart,
  };
};

export default useCartLogic;
