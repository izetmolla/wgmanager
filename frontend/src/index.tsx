import React from "react";
import ReactDOM from 'react-dom/client';
import "assets/style.scss"

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ThemeProvider from "@spazfeed/layout";
import configureStore from '@spazfeed/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const { store, persistor } = configureStore();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();