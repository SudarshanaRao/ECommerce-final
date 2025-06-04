import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, Truck, Package, Ban } from "lucide-react";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);
  const [openTrackModal, setOpenTrackModal] = useState(false);

  const isDelivered = orderDetails?.orderStatus === "delivered";

  const statusColors = {
    confirmed: "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500",
    rejected: "bg-rose-500",
    pending: "bg-yellow-400",
    delivered: "bg-green-500",
    inShipping: "bg-blue-500",
  };

  const trackingSteps = [
    { status: "confirmed", label: "Order Confirmed", icon: <CheckCircle className="text-purple-600" /> },
    { status: "inShipping", label: "In Shipping", icon: <Truck className="text-blue-600" /> },
    { status: "delivered", label: "Delivered", icon: <Package className="text-green-600" /> },
    { status: "rejected", label: "Order Rejected", icon: <Ban className="text-rose-600" /> },
  ];

  const currentStatusIndex = trackingSteps.findIndex((step) => step.status === orderDetails?.orderStatus);


  return (
    <>
      <DialogContent className="sm:max-w-[600px] h-[85vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6 animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-8"
        >
          {/* Order Summary */}
          <div className="grid gap-3">
            {[
              { label: "Order ID", value: orderDetails?._id },
              { label: "Order Date", value: orderDetails?.orderDate.split("T")[0] },
              { label: "Order Price", value: `₹${orderDetails?.totalAmount}` },
              { label: "Payment Method", value: orderDetails?.paymentMethod },
              { label: "Payment Status", value: orderDetails?.paymentStatus },
            ].map(({ label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex justify-between items-center border-b border-purple-200 pb-2"
              >
                <p className="font-semibold text-purple-800">{label}</p>
                <Label className="text-indigo-700 font-medium">{value}</Label>
              </motion.div>
            ))}

            {/* Order Status with badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-between items-center border-b border-purple-200 pb-2"
            >
              <p className="font-semibold text-purple-800">Order Status</p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge
                  className={`py-1 px-4 rounded-full text-white font-semibold shadow-md ${
                    statusColors[orderDetails?.orderStatus] || "bg-gray-700"
                  }`}
                >
                  {orderDetails?.orderStatus?.toUpperCase()}
                </Badge>
              </motion.div>
            </motion.div>
          </div>

          <Separator className="bg-purple-200" />

          {/* Cart Items */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-purple-800">Order Details</h3>
            <ul className="divide-y divide-purple-200 rounded-md border border-purple-200 overflow-hidden bg-white/50 backdrop-blur-md">
              {orderDetails?.cartItems?.length ? (
                orderDetails.cartItems.map((item) => (
                  <motion.li
                    key={item.title}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(237, 233, 254, 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex justify-between px-4 py-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="font-medium text-purple-800">Title: {item.title}</span>
                    <span className="text-purple-600">Qty: {item.quantity}</span>
                    <span className="font-semibold text-pink-600">₹{item.price}</span>
                  </motion.li>
                ))
              ) : (
                <p className="text-purple-400 text-center py-4">No items found</p>
              )}
            </ul>
          </div>

          {/* Track Order Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex justify-end mt-4"
          >
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={() => setOpenTrackModal(true)}
            >
              Track Order
            </button>
          </motion.div>

          {/* Shipping Info */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-purple-800">Shipping Info</h3>
            <div className="space-y-1 text-purple-700">
              <p className="font-semibold text-indigo-800">{user?.userName}</p>
              <p>{orderDetails?.addressInfo?.address}</p>
              <p>{orderDetails?.addressInfo?.city}</p>
              <p>{orderDetails?.addressInfo?.pincode}</p>
              <p>{orderDetails?.addressInfo?.phone}</p>
              {orderDetails?.addressInfo?.notes && (
                <p className="italic text-purple-500">{orderDetails.addressInfo.notes}</p>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>

      {/* Track Order Modal */}
      <Dialog open={openTrackModal} onOpenChange={setOpenTrackModal}>
      <DialogContent className="max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 text-center mb-6">
            📦 Track Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timeline Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative border-l-4 border-gradient-to-b from-purple-400 via-pink-400 to-indigo-400 pl-6 space-y-10 ml-3"
          >
            {trackingSteps
              .filter((step) =>
                orderDetails?.orderStatus === "rejected"
                  ? step.status === "rejected"
                  : step.status !== "rejected"
              )
              .map((step, index) => {
                const isActive = step.status === orderDetails?.orderStatus;
                const isCompleted = isDelivered || index < currentStatusIndex;

                return (
                  <motion.div
                    key={step.status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                    className="relative flex items-start gap-4"
                  >
                    {/* Progress Dot */}
                    <div className="absolute -left-[34px] top-1">
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-full border-4 
                        ${
                          isCompleted
                            ? "border-green-500 bg-green-100"
                            : isActive
                            ? "border-purple-500 bg-white animate-pulse shadow-md"
                            : "border-gray-300 bg-gray-100"
                        }`}
                      >
                        <span
                          className={`${
                            isCompleted
                              ? "text-green-600"
                              : isActive
                              ? "text-purple-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div>
                      <p
                        className={`text-base font-semibold ${
                          isCompleted
                            ? "text-green-600"
                            : isActive
                            ? "text-purple-700"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-sm italic ${
                          isCompleted
                            ? "text-green-500"
                            : isActive
                            ? "text-purple-500"
                            : "text-gray-300"
                        }`}
                      >
                        {isActive
                          ? "• Current status"
                          : isCompleted
                          ? "• Completed"
                          : "• Pending"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>

          {/* Right Side Message (if delivered) */}
          {isDelivered && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-gradient-to-br from-green-100 to-green-200 shadow-inner"
            >
              <Package className="w-12 h-12 text-green-600 mb-3" />
              <h3 className="text-xl font-semibold text-green-700 mb-1">
                🎉 Delivered Successfully!
              </h3>
              <p className="text-green-600 text-sm">
                Your order has reached its destination. Thank you for shopping with us!
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ShoppingOrderDetailsView;
