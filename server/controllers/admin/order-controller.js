const Order = require("../../models/Order");

// Get all orders (Admin)
const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error in getAllOrdersOfAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Get orders by userId
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId parameter.",
      });
    }

    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user!",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error in getOrdersByUserId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Get single order details (Admin)
const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing order ID parameter.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error in getOrderDetailsForAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!id || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrdersByUserId,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
