import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import Error from "./routes/Error";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import Home from "./routes/Home";
import Transactions from "./routes/Transactions";
import App from "./App";
import PersistLogin from "./components/auth/PersistLogin";
import "./main.css";
import AuthRoot from "./routes/AuthRoot";
import Settings from "./routes/Settings";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PersistLogin />,
    errorElement: <Error />,
    children: [
      {
        element: <Root />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "transactions",
            element: <Transactions />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth/",
    element: <AuthRoot />,
    errorElement: <Error />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);
