import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector(
    (state) => state.shopOrder
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function handleFetchOrderDetails(orderId) {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails(orderId));
  }

  const statusColors = {
    confirmed: "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500",
    rejected: "bg-red-500",
    pending: "bg-yellow-400 text-black",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-2xl border border-indigo-100 bg-white/60 backdrop-blur-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-purple-700 text-2xl font-bold">
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100">
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <motion.tr
                    key={orderItem._id}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="hover:bg-purple-50/60 cursor-pointer rounded-lg"
                  >
                    <TableCell>{orderItem._id}</TableCell>
                    <TableCell>
                      {orderItem.orderDate
                        ? orderItem.orderDate.split("T")[0]
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-white font-semibold py-1 px-3 rounded-full shadow-md ${
                          statusColors[orderItem.orderStatus] || "bg-gray-500"
                        }`}
                      >
                        {orderItem.orderStatus?.toUpperCase() || "UNKNOWN"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-indigo-600">
                      ₹{orderItem.totalAmount ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:opacity-90 text-white shadow-md"
                        onClick={() => handleFetchOrderDetails(orderItem._id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    {isLoading ? "Loading orders..." : "No orders found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Single Dialog rendered outside map */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
            setSelectedOrderId(null);
          }
        }}
      >
        <ShoppingOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </motion.div>
  );
}

export default ShoppingOrders;
