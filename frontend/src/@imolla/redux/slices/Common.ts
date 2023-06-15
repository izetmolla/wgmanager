import { createSlice } from "@reduxjs/toolkit";
import { CommonTypes } from "../../types";

// Define a type for the slice state

export const initialState: CommonTypes = {
  layount_compnents: [
    { path: "/", leftsidebar: true },
    { path: "/dashboard", leftsidebar: true },
    { path: "/login", header: false, leftsidebar: false },
  ],
  loading: false,
  theme: "light",

  sidebarShow: true,
  asideShow: false,
  unfoldable: false,
};

const Common = createSlice({
  name: "common",
  initialState,
  reducers: {
    setCommonLoading(state, action) {
      state.loading = action.payload;
    },
    setTheme: (state, action) => {
      // state.tokens.access_token = action.payload
    },

    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setSidebarUnfoldable: (state, action) => {
      state.unfoldable = action.payload;
    },
  },
});

export const {
  setTheme,
  setCommonLoading,
  setSidebarShow,
  setSidebarUnfoldable,
} = Common.actions;
export default Common.reducer;
