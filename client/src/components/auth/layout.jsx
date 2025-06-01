import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100 overflow-hidden">
      {/* Left Pane with Welcome */}
      <div className="relative hidden w-1/2 items-center justify-center bg-black lg:flex px-12">
        {/* Blobs */}
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-indigo-500 opacity-30 blur-3xl animate-ping"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-pink-500 opacity-30 blur-3xl animate-pulse"></div>

        <motion.div
          className="z-10 max-w-md space-y-6 text-center text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to <br />
            E-Commerce Shopping 🛒
          </h1>
          <p className="text-lg text-gray-300">
            Experience the best way to shop online with blazing speed and security.
          </p>
        </motion.div>
      </div>

      {/* Right Pane with Outlet */}
      <motion.div
        className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}

export default AuthLayout;
