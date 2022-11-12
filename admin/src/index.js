import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { DarkModeContextProvider } from "./context/darkModeContext";

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <DarkModeContextProvider>
                {/* 2:56:43 */}
                <App />
            </DarkModeContextProvider>
        </AuthContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
