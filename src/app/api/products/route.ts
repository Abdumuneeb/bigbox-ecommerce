import {
  getProductsHandler,
  createProductHandler,
} from "@/backend/controllers/productControllers";

export const GET = getProductsHandler;
export const POST = createProductHandler;
