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

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(loginUser(formData));
      const success = result?.payload?.success;

      if (success) {
        toast({ title: result.payload.message });
        localStorage.setItem("email", formData.email);

        const otpResult = await dispatch(sendOtp(formData.email));
        if (otpResult?.payload) {
          toast({ title: "OTP sent to your email." });
        } else {
          toast({ title: "Failed to send OTP", variant: "destructive" });
        }
      } else {
        toast({ title: "Unable to login", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <motion.div
        className="z-10 mx-auto w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CommonForm
            formControls={loginFormControls}
            buttonText="Sign In"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />

          {/* Forgot Password Link */}
          <div className="mt-4 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AuthLogin;
