const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
require('dotenv').config();

//register
const registerUser = async (req, res) => {
  const { userName, email, password, isOtpVerified, mobile } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      mobile,
      password: hashPassword,
      isOtpVerified,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        mobile: checkUser.mobile,
        userName: checkUser.userName,
        isOtpVerified: checkUser.isOtpVerified,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        mobile: checkUser.mobile,
        userName: checkUser.userName,
        isOtpVerified: checkUser.isOtpVerified,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};


const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo API client
const secretKey = process.env.BREVO_API_KEY;
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = secretKey;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Store OTPs temporarily
const otpStore = {}; 

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Save OTP
  otpStore[email] = { otp: generatedOtp, expiresAt };

  // Setup transactional email
  const sendSmtpEmail = {
    to: [{ email }],
    templateId: 1, 
    params: {
      OTP: generatedOtp
    },
    headers: {
      'X-Mailin-custom': 'OTP delivery'
    },
    sender: {
      name: "FinStore",
      email: "pandu.sudha2003@gmail.com" 
    }
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ OTP ${generatedOtp} sent to ${email}`);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP via Brevo SDK:", error.response?.body || error.message);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};



// Verify OTP endpoint
const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required.!" });

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ success: false, message: "OTP not found or already used." });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  delete otpStore[email];
  return res.status(200).json({ success: true, message: "OTP verified successfully." });
};


//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  verifyOTP,
  sendOtp,
};