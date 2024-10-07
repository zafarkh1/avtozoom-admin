import { HiOfficeBuilding } from "react-icons/hi";
import { Menu } from "antd";
import { CarOutlined, SnippetsOutlined, ShopOutlined } from "@ant-design/icons";
import { BiCategory } from "react-icons/bi";
import { useSidebarCollapse } from "../../zustand/SidebarCollapseStore";
import { useNavigate } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <BiCategory style={{ fontSize: "1.2rem" }} />,
    label: "Categories",
    link: "/",
  },
  {
    key: "2",
    icon: <ShopOutlined style={{ fontSize: "1.2rem" }} />,
    label: "Brands",
    link: "/brands",
  },
  {
    key: "3",
    icon: <SnippetsOutlined style={{ fontSize: "1.2rem" }} />,
    label: "Models",
    link: "/models",
  },
  {
    key: "4",
    icon: <HiOfficeBuilding style={{ fontSize: "1.2rem" }} />,
    label: "Cities",
    link: "/cities",
  },
  {
    key: "5",
    icon: <CarOutlined style={{ fontSize: "1.2rem" }} />,
    label: "Cars",
    link: "/cars",
  },
];

function Sidebar(props) {
  const { isSidebarCollapse } = useSidebarCollapse();
  const navigate = useNavigate();

  const handleMenuItem = (e) => {
    const clickedItem = items.find((i) => i.key === e.key);

    if (clickedItem) {
      navigate(clickedItem.link);
    }
  };

  return (
    <div
      className={`relative z-20 h-screen bg-[#001529] pt-4 transition-all duration-500 ${
        isSidebarCollapse ? "w-20" : "w-80"
      }`}
    >
      <a href="/" className="transition-all duration-500">
        {isSidebarCollapse ? (
          <img
            src="https://autozoom-admin-nine.vercel.app/assets/autozoom-CM99tOti.svg"
            alt="logo"
            className="mb-4"
          />
        ) : (
          <p className="text-[#a6adb4] hover:text-white text-center lg:text-2xl font-semibold">
            AutozoomAdmin
          </p>
        )}
      </a>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={isSidebarCollapse}
        items={items}
        className="transition-all duration-500 font-medium"
        onClick={handleMenuItem}
      />
    </div>
  );
}

export default Sidebar;
