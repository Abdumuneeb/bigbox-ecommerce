import {
  completeOrdersHandler,
  deleteOrderHandler,
  getOrdersHandler,
} from "@/backend/controllers/orderControllers";

export const DELETE = deleteOrderHandler;
export const PUT = completeOrdersHandler;
export const GET = getOrdersHandler;
