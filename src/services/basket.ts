import { Basket } from "../types/basket";
import { Product } from "@/types/product";
import { v4 as uuid } from "uuid";

const basket: Basket = { products: [] };

export function getBasket(): Basket {
  return basket;
}

export function getProductBasket(id: typeof uuid): Product | string {
  if (basket.products.length == 0) return "errors.basket.item.empty";
  const find_product: number = basket.products.findIndex(
    (prod) => prod.id === id
  );
  return find_product > -1
    ? basket.products[find_product]
    : "errors.basket.item.not-found";
}

export function addProductBasket(product: Product, qty: number = 1) {
  const find_product: number = basket.products.findIndex(
    (prod) => prod.id === product.id
  );
  if (find_product > -1) {
    basket.products[find_product].qty += qty;
  } else {
    basket.products.push({ ...product, qty });
  }
  return;
}

export function removeProductBasket(product: Product, qty: number = -1) {
  const find_product: number = basket.products.findIndex(
    (prod) => prod.id === product.id
  );
  if (find_product > -1) {
    if (qty == -1) {
      basket.products.splice(find_product, 1);
    } else {
      basket.products[find_product].qty -= qty;
    }
  }
}
