import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  const statusColors = {
    confirmed: "bg-blue-500",
    rejected: "bg-rose-500",
    pending: "bg-yellow-400",
    delivered: "bg-green-500",
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-8 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-300 dark:bg-gray-900 dark:bg-opacity-70 dark:border-gray-700">
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
              orderDetails.cartItems.map((item, index) => (
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
  );
}

export default ShoppingOrderDetailsView;
