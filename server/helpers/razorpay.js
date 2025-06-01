const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_FDNjIkr610t3ST",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "q5SM3HshkUUwNyP1Np7b0agV",
});

module.exports = razorpay;
