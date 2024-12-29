import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Brand from "../assets/brand.svg";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { faChartLine, faClock, faComment, faCompass, faFile, faFolder, faGear, faPlay, faWallet } from "@fortawesome/free-solid-svg-icons";

const DashboardContent = () => {
  return <div>Content</div>;
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

const SideBar = ({ children }) => {
  return (
    <Card className="min-w-[250px] h-screen overflow-hidden" radius="none">
      <CardHeader className="flex gap-3 flex-col px-10">
        <Image alt="asnesia logo" radius="none" src={Brand} width={175} />
        <div className="flex flex-col items-center">
          <Avatar
            className="w-28 h-28 text-large mt-5 mb-5"
            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          />
          <p className="text-md font-semibold">NextUI</p>
          <p className="text-small text-default-500">nextui.org</p>
        </div>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

SideBar.propTypes = {
  children: PropTypes.node,
};

const Dashboard = ({ children, menu = "beranda" }) => {
  const activeMenu = "bg-asnesia-darkblue text-asnesia-yellow";

  return (
    <div className={`dashboard flex`}>
      <SideBar>
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
            <span className="flex gap-3 items-center text-lg"><FontAwesomeIcon icon={faWallet} />Pembayaran</span>
          </SideBarMenu>

          <SideBarMenu
            link={`/settings`}
            className={menu === "settings" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg"><FontAwesomeIcon icon={faGear} />Pengaturan</span>
          </SideBarMenu>

          <SideBarMenu
            link={`/Discuss`}
            className={menu === "discuss" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg"><FontAwesomeIcon icon={faComment} />Disukusi</span>
          </SideBarMenu>
          <Divider />
          <SideBarMenu
            link={`/modul`}
            className={menu === "modul" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg"><FontAwesomeIcon icon={faFolder} />Modul</span>
          </SideBarMenu>

          <SideBarMenu
            link={`/video`}
            className={menu === "video" ? activeMenu : ""}
          >
            <span className="flex gap-3 items-center text-lg"><FontAwesomeIcon icon={faPlay} />Video</span>
          </SideBarMenu>
        </div>
      </SideBar>
      <DashboardContent>{children}</DashboardContent>
    </div>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node,
  menu: PropTypes.string,
};

export default Dashboard;
