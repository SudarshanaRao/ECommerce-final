import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} className="text-blue-600" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} className="text-green-600" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} className="text-purple-600" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false);
          }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-900 transition-all duration-200"
        >
          {menuItem.icon}
          <span className="text-md font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-white shadow-md">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="flex items-center gap-2 mt-5 mb-2 text-blue-700">
                <ChartNoAxesCombined size={28} />
                <span className="text-xl font-bold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 shadow-md">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-3 mb-6 cursor-pointer"
        >
          <ChartNoAxesCombined size={28} className="text-blue-700" />
          <h1 className="text-xl font-extrabold text-blue-800">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
