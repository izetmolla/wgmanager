import { RootState } from "../store";
import { AuthorizationTypes } from "@spazfeed/types";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state

const initialState: AuthorizationTypes = {
  auth_redirect: null,
  isLoading: false,
  isLoggedin: false,
  user: null,
  tokens: {
    access_token: "",
    refresh_token: "",
  },
  error: null,
};

const Authorization = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    authorizeUser: (state, action) => {
      Object.assign(state, action.payload);
    },
    setAuthorizationLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setAuhorizationContent: (state, action) => {
      Object.assign(state, action.payload);
    },
    setAccessToken: (state, action) => {
      state.tokens.access_token = action.payload;
    },
    logOut: (state) => {
      // state.current_user = null
      state.user = null;
      state.isLoggedin = false;
      state.tokens = { access_token: null, refresh_token: null };
      // state.members = []
    },
    setAuthRedirect: (state, action) => {
      state.auth_redirect = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      // Object.assign(state, action.payload)
      // state.user = { ...state.user, ...action.payload }
      // state.isLoggedIn = true
    },
    signIn: (state, action) => {
      console.log({
        action,
        state,
      });
      // state.user = { ...state.user, ...action.payload }
      // state.isLoggedIn = true
    },
    signOut: (state) => {
      state.user = {};
      state.isLoggedin = false;
    },
  },
  // extraReducers: (builder) => {
  //     builder.addCase(loginUserAction.fulfilled, (state, action) => {
  //         console.log(action.payload)
  //         Object.assign(state, action.payload)
  //         // state.current_user = action.payload.username
  //     })
  // },
});

export const {
  signIn,
  signOut,
  setAuthorizationLoading,
  setAuhorizationContent,
  setError,
  authorizeUser,
} = Authorization.actions;
export const user = (state: RootState) => state.authorization.user;
export const { setAccessToken, setAuthRedirect, logOut } =  Authorization.actions;
export default Authorization.reducer;
