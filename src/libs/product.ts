import { promises as fs } from "fs";
import path from "path";
import {
  ProductType,
  ReadProductsResult,
  WriteProductsResult,
} from "../types/product";

const PRODUCT_PATH = path.join(process.cwd(), "db", "products.json");

export async function readProducts(
  userId?: string,
  includeDeleted = false
): Promise<ReadProductsResult> {
  try {
    const raw = await fs.readFile(PRODUCT_PATH, "utf-8");
    const products: ProductType[] | unknown = JSON.parse(raw);
    if (!Array.isArray(products)) {
      return {
        success: false,
        error: { errorStatus: 500, errorMessage: "errors.products.empty" },
      };
    }
    const filteredProducts = includeDeleted
      ? products
      : products.filter((product) => !product.delete);
    if (userId) {
      const subProducts = filteredProducts.filter(
        (product) => product.userId === userId
      );
      return { success: true, data: subProducts };
    }
    return { success: true, data: filteredProducts };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorConsole: err,
        errorMessage: "errors.products.read",
      },
    };
  }
}

export async function writeProducts(
  products: ProductType[],
  ownerId: string
): Promise<WriteProductsResult> {
  try {
    for (const product of products) {
      if (product.userId !== ownerId) {
        return {
          success: false,
          error: {
            errorMessage: "Product is not a ownable thing with this user",
            errorStatus: 401,
          },
        };
      }
    }

    if (products)
      await fs.writeFile(
        PRODUCT_PATH,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.products.write",
        errorConsole: err,
      },
    };
  }
}

export const updateProduct = async (
  id: string,
  userId: string,
  data: ProductType
): Promise<WriteProductsResult> => {
  try {
    const products = await readProducts(userId);
    if (!products.success) {
      return products;
    }
    const productsData: ProductType[] = products.data as ProductType[];

    const index = productsData.findIndex((p: ProductType) => p.id === id);
    if (index == -1) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.users.user.found",
        },
      };
    }
    const updatedProduct = {
      ...productsData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    productsData[index] = updatedProduct;
    await writeProducts(productsData, userId);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.products.product.update",
        errorConsole: err,
      },
    };
  }
};

export const softDeleteProduct = async (id: string, userId: string) => {
  try {
    const products = await readProducts(userId, true);
    if (!products.success) {
      throw new Error("API Error: No possible to delete product");
    }
    const productsData: ProductType[] = products.data as ProductType[];

    const index = productsData.findIndex((p: ProductType) => p.id === id);
    if (index === -1 || productsData[index].delete) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.products.product.found",
        },
      };
    }
    productsData[index].delete = true;
    productsData[index].updatedAt = new Date().toISOString();
    await writeProducts(productsData, userId);
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.products.product.delete",
        errorConsole: err,
      },
    };
  }
};

export const createProduct = async (
  userId: string,
  data: ProductType
): Promise<WriteProductsResult> => {
  try {
    const products = await readProducts(userId, true);
    const productsData = products.success
      ? (products.data as ProductType[])
      : [];
    const newProduct: ProductType = {
      ...data,
      userId,
    };
    productsData.push(newProduct);
    await writeProducts(productsData, userId);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.products.product.create",
        errorConsole: err,
      },
    };
  }
};

export async function getProductById(
  id: string,
  includeDeleted: boolean
): Promise<ReadProductsResult> {
  try {
    const products = await readProducts(undefined, includeDeleted);
    if (!products.success) {
      return products;
    }
    const productsData: ProductType[] = products.data as ProductType[];
    const index = productsData.findIndex((p: ProductType) => p.id === id);
    if (index === -1) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.users.user.found",
        },
      };
    }
    return { success: true, data: [productsData[index]] };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.users.user.read",
        errorConsole: err,
      },
    };
  }
}
