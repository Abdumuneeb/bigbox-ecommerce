import {
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
} from "@/backend/controllers/productControllers";

export const PUT = updateProductHandler;
export const DELETE = deleteProductHandler;
export const GET = getProductHandler;
