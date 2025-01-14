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
import MyPackage from "./MyPackage";
import Tryout from "./Tryout";
import PackageAvailable from "./PackageAvailable";
import { createContext, StrictMode } from "react";
import PackageDetail from "./PackageDetail";
import Exam from "./Exam";
import ErrorPage2 from "./ErrorPage2";
import CardContent from "./component/CardContent";
import Order from "./Order";

function setUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user.user));
}

function getUser() {
  const userdata = sessionStorage.getItem("user");
  const user = JSON.parse(userdata);
  return user;
}

function removeUser() {
  // Menghapus data user dari sessionStorage saat logout
  if (sessionStorage.getItem('user')) {
    sessionStorage.removeItem('user');
  } else {
    console.log("No user data found in localStorage.");
  }

  localStorage.clear();
  console.log("All data in localStorage has been cleared.");
}

export const AuthContext = createContext(null)

const auth = getUser();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/login-or-register",
    element: <LoginRegister setUser={setUser} />,
  },
  {
    path: "/dashboard",
    element: (
      <Dashboard menu="beranda" title="Beranda">
        <Beranda />
      </Dashboard>
    ),
  },
  {
    path: "/service-puscharge",
    element: (
      <Dashboard menu="my-packages" title="Paket Saya">
        <MyPackage />
      </Dashboard>
    ),
  },
  {
    path: "/service-available",
    element: (
      <Dashboard menu="service-available" title="Cari Paket">
        <PackageAvailable />
      </Dashboard>
    ),
  },
  {
    path: "/tryout",
    element: (
      <Dashboard menu="tryout" title="Riwayat Tryout">
        <Tryout />
      </Dashboard>
    ),
  },
  {
    path: "/settings",
    element: (
      <Dashboard menu="settings" title="Pengaturan">
        <CardContent />
      </Dashboard>
    ),
  },
  {
    path: "/order",
    element: (
      <Dashboard menu="order" title="Pembayaran">
        <Order />
      </Dashboard>
    ),
  },
  {
    path: "/discuss",
    element: (
      <Dashboard menu="discuss" title="Diskusi">
        <CardContent />
      </Dashboard>
    ),
  },
  {
    path: "/modul",
    element: (
      <Dashboard menu="modul" title="Modul">
        <CardContent />
      </Dashboard>
    ),
  },
  {
    path: "/video",
    element: (
      <Dashboard menu="video" title="Video">
        <CardContent />
      </Dashboard>
    ),
  },
  {
    path: "/service-puscharge/view/:orderid",
    element: (
      <Dashboard menu="service-available" title="Detail Packet" >
        <PackageDetail />
      </Dashboard>
    ),
  },

  {
    path: "/exams/:examid",
    element: <Exam />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/error", // Rute error khusus
    element: <ErrorPage2 />, // Halaman error khusus
  },
]);

// Memanggil createRoot hanya sekali di sini
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <NextUIProvider>
      <AuthContext.Provider value={{auth, setUser, getUser, removeUser}}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </NextUIProvider>
  </StrictMode>
);
