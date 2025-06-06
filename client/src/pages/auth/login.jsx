import { motion } from "framer-motion";
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, sendOtp } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

function onSubmit(event) {
  event.preventDefault();

  dispatch(loginUser(formData))
    .unwrap()
    .then((payload) => {
      if (payload.success) {
        toast({ title: payload.message });

        // Save email to localStorage for further verification if needed
        localStorage.setItem("email", formData.email);

        // 🔐 Send OTP after login success
        dispatch(sendOtp(formData.email)).then((otpData) => {
          if (otpData?.payload?.success) {
            toast({ title: "OTP sent to your email." });

            // Optionally redirect to OTP verification screen
            // navigate("/verify-otp"); 
          } else {
            toast({ title: "Failed to send OTP", variant: "destructive" });
          }
        });
      } else {
        toast({
          title: payload.message || "Unable to login",
          variant: "destructive",
        });
      }
    })
    .catch((error) => {
      toast({
        title: error.message || "Server error during login",
        variant: "destructive",
      });
    });
}


  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Animated floating shapes */}

      {/* Card */}
      <motion.div
        className="z-10 mx-auto w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Don’t have an account?
            <Link
              className="ml-2 font-medium text-indigo-600 hover:underline"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AuthLogin;