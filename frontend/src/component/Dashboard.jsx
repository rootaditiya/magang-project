import { AuthContext } from "../main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Brand from "../assets/brand.svg";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router";
import {
  faCaretDown,
  faChartLine,
  faClock,
  faComment,
  faCompass,
  faFile,
  faFolder,
  faGear,
  faKey,
  faPlay,
  faRightFromBracket,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";

const DashboardFooter = () => {
  return (
    <div className="dashboard-footer bg-asnesia-darkblue text-white px-10 py-5 mt-auto mb-0 w-full">
      <p>
        Copyright &copy; {new Date().getFullYear()}, All Rights Reserved.
        <span className="font-semibold ml-2">APPSKEP</span>
      </p>
      <p className="text-sm mt-3">
        <a href="/terms">Syarat dan ketentuan</a> |{" "}
        <a href="/privacy">Kebijakan Privasi</a>
      </p>
    </div>
  );
};

const DashboardContent = ({ children, title = "beranda" }) => {
  return (
    <div className="p-9 ">
      <h1 className="text-3xl font-semibold mb-6 w-full">{title}</h1>
      {children}
    </div>
  );
};

DashboardContent.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

const SideBarMenu = ({ children, className, link }) => {
  return (
    <Link
      to={link}
      className={`${className} pl-10 py-4 w-full rounded-md font-semibold hover:cursor-pointer hover:bg-asnesia-darkblue/20`}
    >
      {children}
    </Link>
  );
};

SideBarMenu.propTypes = {
  className: PropTypes.string,
  menu: PropTypes.string,
  children: PropTypes.node,
  link: PropTypes.string,
};

const SideBar = ({ children, user }) => {
  return (
    <Card className="min-w-[250px] h-screen overflow-hidden" radius="none">
      <CardHeader className="flex gap-3 flex-col px-10">
        <Link to="/">
          <Image alt="asnesia logo" radius="none" src={Brand} width={175} />
        </Link>
        <div className="flex flex-col items-center">
          <Avatar
            className="w-28 h-28 text-large mt-5 mb-5"
            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          />
          <p className="text-md font-semibold">{user?.name || "Loading..."}</p>
          <p className="text-small text-default-500">
            {user?.email || "Loading..."}
          </p>
        </div>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

SideBar.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
};

const Dashboard = ({ children, menu = "beranda", title }) => {
  const { getUser, removeUser } = useContext(AuthContext);
  const [auth, setAuth] = useState(getUser());
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Melakukan pengalihan setelah render pertama jika user tidak ada
    if (!auth) {
      navigate("/login-or-register");
      return;
    }

    console.log("user =", auth);

    fetch(`http://localhost:8080/users/${auth}`)
      .then((response) => {
        // Periksa jika respons berhasil
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Mengambil data dalam format JSON
      })
      .then((data) => {
        console.log(data); // Menampilkan data yang diterima
        setUser(data); // Mengupdate state dengan data yang diterima
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [auth, navigate]);

  const activeMenu = "bg-asnesia-darkblue text-asnesia-yellow";

  const handleLogout = () => {
    try {
      if (!auth) {
        console.error("User is not authenticated.");
        return;
      }

      setAuth(null); // Reset state
      console.log("State updated to null.");
      console.log("Logging out...");
      removeUser(); // Hapus data user dari penyimpanan atau state
      console.log("User data removed.");

      navigate("/login-or-register"); // Arahkan ke halaman login
    } catch (error) {
      console.error("Logout error:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <div className={`dashboard flex`}>
      <SideBar user={user}>
        <div className="sidebar-content flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
          <SideBarMenu
            link={`/dashboard`}
            className={menu === "beranda" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faChartLine} />
              Beranda
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/service-puscharge`}
            className={menu === "my-packages" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faFile} />
              Paket Saya
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/service-available`}
            className={menu === "service-available" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faCompass} />
              Cari Paket
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/tryout`}
            className={menu === "tryout" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faClock} />
              Riwayat Try Out
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/order`}
            className={menu === "order" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faWallet} />
              Pembayaran
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/settings`}
            className={menu === "settings" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faGear} />
              Pengaturan
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/Discuss`}
            className={menu === "discuss" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faComment} />
              Disukusi
            </span>
          </SideBarMenu>
          <div className="my-5">
            <Divider />
          </div>
          <SideBarMenu
            link={`/modul`}
            className={menu === "modul" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faFolder} />
              Modul
            </span>
          </SideBarMenu>

          <SideBarMenu
            link={`/video`}
            className={menu === "video" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg">
              <FontAwesomeIcon icon={faPlay} />
              Video
            </span>
          </SideBarMenu>
        </div>
      </SideBar>
      <div className="flex flex-col w-full overflow-hidden h-screen">
        <div className="sticky flex header px-10 py-5 justify-end bg-asnesia-darkblue text-white hover:cursor-pointer">
          <ButtonGroup variant="flat" color="none">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button>
                  <div className="user justify-items-center">
                    <p className="text-lg font-semibold">
                      {user?.name || "Loading..."}
                    </p>
                    <p className="text-default-500">
                      {user?.ID || "Loading..."}
                    </p>
                  </div>
                  <FontAwesomeIcon icon={faCaretDown} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                className="max-w-[300px]"
                selectionMode="single"
              >
                <DropdownItem key="profile" textValue="Profile">
                  <p className="flex gap-2">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Profil</span>
                  </p>
                </DropdownItem>
                <DropdownItem key="change-password" textValue="Change Password">
                  <p className="flex gap-2">
                    <FontAwesomeIcon icon={faKey} />
                    <span>Ubah Password</span>
                  </p>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  textValue="Logout"
                  onPress={handleLogout}
                >
                  <p className="flex gap-2">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Logout</span>
                  </p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
        <div className="flex flex-col overflow-y-auto scrollbar-thin h-full w-full">
          <DashboardContent title={title}>{children}</DashboardContent>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  // user: PropTypes.object,
  children: PropTypes.node,
  menu: PropTypes.string,
  title: PropTypes.string,
};

export default Dashboard;
