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
import Anonymous from "./components/auth/Anonymous";

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
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Anonymous />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
        errorElement: <Error />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
        errorElement: <Error />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);
