import { useEffect, useState } from "react";
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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="shadow-lg rounded-xl border border-gray-200 animate-fade-in p-2 sm:p-4">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-indigo-700">All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="text-sm sm:text-base">
          <TableHeader>
            <TableRow className="bg-indigo-100 text-indigo-800">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Order Date</TableHead>
              <TableHead className="font-semibold">Order Status</TableHead>
              <TableHead className="font-semibold">Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <motion.tr
                  key={orderItem?._id}
                  className="transition-all hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell className="text-gray-700">{orderItem?._id}</TableCell>
                  <TableCell className="text-gray-700">
                    {orderItem?.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 text-white capitalize tracking-wide rounded-md shadow-sm ${
                        orderItem?.orderStatus === "delivered"
                        ? "bg-green-600"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : orderItem?.orderStatus === "pending"
                        ? "bg-yellow-500"
                        : orderItem?.orderStatus === "inShipping"
                        ? "bg-blue-600"
                        : "bg-gray-500"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    ₹{orderItem?.totalAmount}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white px-3 py-1 rounded-md shadow"
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 italic">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
