const razorpay = require("../../helpers/razorpay"); // Razorpay instance
const crypto = require("crypto");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// ✅ CREATE ORDER WITH RAZORPAY
const createAndInitOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    if (!userId || !cartItems || !addressInfo || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required order fields" });
    }

    const options = {
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1, // Optional: auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: orderStatus || "pending",
      paymentMethod: paymentMethod || "razorpay",
      paymentStatus: paymentStatus || "unpaid",
      totalAmount,
      orderDate: orderDate || new Date(),
      orderUpdateDate: orderUpdateDate || new Date(),
      paymentId: razorpayOrder.id, // Razorpay Order ID
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Razorpay order created",
      razorpayOrderId: razorpayOrder.id,
      orderId: newOrder._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (e) {
    console.error("Error in createAndInitOrder:", e);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

// ✅ VERIFY PAYMENT SIGNATURE & UPDATE ORDER
const verifyAndCapturePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'q5SM3HshkUUwNyP1Np7b0agV')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpay_payment_id;

    // Decrement stock for each product in order.cartItems
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.title || item.productId}` });
      }
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.title || item.productId}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    // Delete cart associated with this order
    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      data: order,
    });
  } catch (e) {
    console.error("Error in verifyAndCapturePayment:", e);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
    });
  }
};

module.exports = {
  createAndInitOrder,
  verifyAndCapturePayment,
};
