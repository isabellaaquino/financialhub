import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import Error from "./routes/Error";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import { AuthProvider } from "./context/AuthContext";
import Transactions from "./routes/Transactions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    errorElement: <Error />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
    errorElement: <Error />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
