import { api } from "./api";
import { axiosInstances } from "./axiosService";

export const signIn = async (data: any) => {
  const response = await axiosInstances.post(api.signIn, data);
  return response;
};

// converted to V2
export const signUp = async (data: any) => {
  const response = await axiosInstances.post(api.signUp, data);
  return response;
};
