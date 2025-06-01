const express = require("express");

const {
  createAndInitOrder,
  verifyAndCapturePayment,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createAndInitOrder);
router.post("/verify-payment", verifyAndCapturePayment);

module.exports = router;
