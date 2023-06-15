import network from "@imolla/services/network";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  authorizeUser,
  setAuthorizationLoading,
  setError,
} from "../slices/Authorization";

export const loginAction = createAsyncThunk(
  "authorization/loginAction",
  async (
    { username, password }: { username: string; password: string },
    { dispatch }
  ) => {
    dispatch(setAuthorizationLoading(true));
    return network
      .post("/login", { username, password })
      .then(({ data }: any) => {
        if (data?.status === "success") {
          console.log("success", data);
          dispatch(authorizeUser({ ...data?.data, isLoggedin: true }));
        } else {
          dispatch(setError(data?.error));
        }
        dispatch(setAuthorizationLoading(false));
      })
      .catch((error: any) => {
        console.log("Error", error);
        dispatch(setAuthorizationLoading(false));
      });
  }
) as any;

export const checkAction = createAsyncThunk(
  "authorization/checkAction",
  async (_, { dispatch }) => {
    return network
      .post("/check")
      .then(({ data }: any) => {
        if (data?.status === "success") {
          // dispatch(setSetupData(data?.setup))
        } else {
          console.log("error happened", data);
        }
      })
      .catch((error: any) => {
        console.log("Error", error);
      });
  }
);

export const checkUserAction = createAsyncThunk(
  "authorization/checkUserAction",
  async (_, { dispatch }) => {
    return network
      .post("/check_user")
      .then(({ data }: any) => {
        if (data?.status === "success") {
          // dispatch(setSetupData(data?.setup))
        } else {
          console.log("error");
        }
        console.log(data);
      })
      .catch((error: any) => {
        console.log("Error", error);
        return error;
      });
  }
);
