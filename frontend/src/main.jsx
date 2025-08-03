import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { WebSocketProvider } from "./websocketprovider";
export const Context = createContext({
  isAuthorized: false,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <WebSocketProvider>
      <Context.Provider
        value={{
          isAuthorized,
          setIsAuthorized,
          user,
          setUser,
        }}
      >
        <App />
      </Context.Provider>
    </WebSocketProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
