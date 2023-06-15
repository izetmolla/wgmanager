import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import Common from "../slices/Common";
import Authorization, { logOut, setAccessToken } from "../slices/Authorization";
import { network, refreshAccessToken, Notification, setAuthToken } from "@spazfeed/services";

const rootReducer = combineReducers({
  common: persistReducer({ key: "common", storage }, Common),
  authorization: persistReducer(
    { key: "authorization", storage },
    Authorization
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
let currentState = store.getState();

network.interceptors.response.use(async (response: any) => {
  if (response.data.message === "Handle Token expired exception here") {
    let res = await refreshAccessToken(currentState.authorization.tokens?.refresh_token || undefined);
    if (res?.data) {
      store.dispatch(setAccessToken(res?.data || ''))
    }
    response.config.headers = { ...response.config.headers, authorization: `Bearer ${res?.data || ''}` }
    return network(response.config);
  } else {
    return response
  }
}, async (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch(logOut())
  } else if (error.response && error.response.status === 502) {
    Notification.fire({ title: "Server Error", text: error?.message, icon: 'error', timer: 4000 })
  } else if (error.response && error.response.status === 404) {
    Notification.fire({ title: "API url not found!", text: error?.message, icon: 'error', timer: 4000 })
  }
  return Promise.reject(error)
});



store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();
  setAuthToken(currentState.authorization.tokens?.access_token || '')
});

export default function configStorea() {
  return { store, persistor };
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
