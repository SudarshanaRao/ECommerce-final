import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  async function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    const data = await dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    );

    if (data?.payload?.success) {
      dispatch(getOrderDetailsForAdmin(orderDetails?._id));
      dispatch(getAllOrdersForAdmin());
      setFormData(initialFormData);
      toast({
        title: data?.payload?.message,
        description: "Order status updated successfully.",
        variant: "success",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[600px] h-[85vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6 animate-fadeIn">
      <div className="grid gap-2">
        {/* Order Basic Info */}
        <div className="grid gap-2 text-gray-800">
          {[
            { label: "Order ID", value: orderDetails?._id },
            { label: "Order Date", value: orderDetails?.orderDate.split("T")[0] },
            { label: "Order Price", value: `₹${orderDetails?.totalAmount}` },
            { label: "Payment Method", value: orderDetails?.paymentMethod },
            { label: "Payment Status", value: orderDetails?.paymentStatus },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center border-b border-gray-200 py-2 transition-colors hover:bg-gray-50 rounded-md px-2"
            >
              <p className="font-semibold text-gray-700">{label}</p>
              <Label className="text-gray-600">{value || "N/A"}</Label>
            </div>
          ))}

          {/* Order Status with Badge */}
          <div className="flex justify-between items-center border-b border-gray-200 py-2 rounded-md px-2">
            <p className="font-semibold text-gray-700">Order Status</p>
            <Label>
              <Badge
                className={`py-2 px-3 rounded-full text-white font-semibold transition-transform transform hover:scale-110 shadow-md ${
                  orderDetails?.orderStatus === "delivered"
                    ? "bg-green-600"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "pending"
                    ? "bg-yellow-500"
                    : orderDetails?.orderStatus === "inShipping"
                    ? "bg-blue-600"
                    : "bg-gray-500"

                }`}
              >
                {(orderDetails?.orderStatus || "Unknown").charAt(0).toUpperCase() + (orderDetails?.orderStatus || "Unknown").slice(1)}

              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        {/* Order Items */}
        <div className="grid gap-2">
          <h3 className="font-semibold text-xl text-gray-900 border-b border-indigo-500 pb-1">
            Order Details
          </h3>
          <ul className="space-y-2 max-h-52 overflow-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100 rounded-md">
            {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item) => (
                <li
                  key={item._id || item.title}
                  className="flex justify-between items-center bg-indigo-50 rounded-md px-2 py-3 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="font-medium text-indigo-900 truncate max-w-xs">
                    {item.title}
                  </span>
                  <span className="text-sm text-indigo-700 font-semibold">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-semibold text-indigo-900">
                    ₹{item.price}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">
                No items in this order.
              </p>
            )}
          </ul>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-2">
          <h3 className="font-semibold text-xl text-gray-900 border-b border-indigo-500 pb-1">
            Shipping Info
          </h3>
          <div className="text-indigo-700 space-y-1 font-medium">
            <p>{user.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>{orderDetails?.addressInfo?.pincode}</p>
            <p>{orderDetails?.addressInfo?.phone}</p>
            <p>{orderDetails?.addressInfo?.notes}</p>
          </div>
        </div>

        {/* Update Status Form */}
        <div className="mt-1">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleUpdateStatus}
            buttonClassName="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-transform text-white font-semibold rounded-md px-2 py-2 shadow-lg"
          />
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        /* Scrollbar styles */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #e0e7ff;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #6366f1;
          border-radius: 3px;
        }
      `}</style>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
