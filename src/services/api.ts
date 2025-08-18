import { get } from "http";

export const api = {
  signIn: "api/auth/login",
  signUp: "api/auth/signup",
  getProducts: "api/products",
  getProduct: (id: any) => `api/products/${id}`,
  getOrders: (id: any) => `api/orders/${id}`,
  addToCart: "api/orders",
  removeProductFromCart: (id: any) => `api/orders/${id}`,
  updateProductStatus: (id: any) => `api/orders/${id}`,
  updateProduct: (id: any) => `api/products/${id}`,
  removeProduct: (id: any) => `api/products/${id}`,
};
