import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import ErrorPage from "./ErrorPage";
import Dashboard from "./component/Dashboard";
import Beranda from "./Beranda";
// import Login from "./Login";
import LoginRegister from "./LoginRegister";
import { NextUIProvider } from "@nextui-org/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login-or-signup",
    element: <LoginRegister />,
  },
  {
    path: "/dashboard",
    element: (
      <Dashboard>
        <Beranda />
      </Dashboard>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </StrictMode>
);
