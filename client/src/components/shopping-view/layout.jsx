import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden 
      bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-150
      relative"
    >
      
      {/* common header */}
      <ShoppingHeader />
      
      <main className="flex-grow w-full overflow-auto bg-opacity-90 backdrop-blur-sm shadow-inner p-6 relative z-10 rounded-t-lg">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
