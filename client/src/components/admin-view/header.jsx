import { AlignJustify, LogOut, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { motion } from "framer-motion";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <motion.header
      className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md z-50"
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Hamburger Menu for Small Screens */}
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-white/10 transition"
      >
        <AlignJustify className="h-6 w-6 text-white" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Logo or Title */}
      <motion.div
        className="text-xl font-bold tracking-wide hidden lg:flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <Sparkles className="w-5 h-5 text-yellow-300" />
        Admin Panel 🚀
      </motion.div>

      {/* Logout Button */}
      <div className="flex-1 flex justify-end">
        <Button
          onClick={handleLogout}
          className="gap-2 rounded-md bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold shadow-md transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.header>
  );
}

export default AdminHeader;
