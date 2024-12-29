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
    path: "/login-or-register",
    element: <LoginRegister />,
  },
  {
    path: "/dashboard",
    element: (
      <Dashboard menu='beranda'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/service-puscharge",
    element: (
      <Dashboard menu='my-packages'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/service-available",
    element: (
      <Dashboard menu='service-available'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/tryout",
    element: (
      <Dashboard menu='tryout'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/settings",
    element: (
      <Dashboard menu='settings'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/order",
    element: (
      <Dashboard menu='order'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/discuss",
    element: (
      <Dashboard menu='discuss'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/modul",
    element: (
      <Dashboard menu='modul'>
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/video",
    element: (
      <Dashboard menu='video'>
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
