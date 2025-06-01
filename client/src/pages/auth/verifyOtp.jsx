import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, sendOtp } from "@/store/auth-slice";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill("")); // Now 6-digit OTP
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { isLoading, isAuthenticated, user, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const firstEmptyIndex = otp.findIndex((val) => val === "");
    if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
      inputRefs.current[firstEmptyIndex].focus();
    }
  }, [otp]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits are filled
    if (newOtp.every((d) => d !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const storedEmail = localStorage.getItem("email");
  const verifyEmail = email || storedEmail;
  
  
  const handleResend = () => {
  if (verifyEmail) {
    dispatch(sendOtp(verifyEmail));
  }
};

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (customOtp = null) => {
    const fullOtp = customOtp || otp.join("");
    if (fullOtp.length < 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    if (!email) {
      alert("Email not found. Please try again.");
      return;
    }

    dispatch(verifyOtp({ email, otp: fullOtp }));
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
            Verify OTP
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Didn’t receive the code?
            <button
                className="ml-2 font-medium text-indigo-600 hover:underline"
                onClick={handleResend}
                disabled={isLoading}
                >
                Resend OTP
                </button>
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center gap-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputRefs.current[idx] = el)}
                className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className={`w-full rounded-md px-4 py-2 text-white font-medium transition ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-700"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          {!isLoading && isAuthenticated === false && (
            <p className="text-red-600 mt-2">
              {error || "OTP verification failed. Please try again."}
            </p>
          )}

          {isAuthenticated && !isLoading && (
            <p className="text-green-600 mt-2">
              
            </p>
          )}
          {isAuthenticated && isLoading && (
            <p className="text-green-600 mt-2">
              OTP verified successfully!
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
