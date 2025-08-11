import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authReducer,
    },
  });
};
