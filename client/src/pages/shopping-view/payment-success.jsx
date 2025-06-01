import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart as clearCartAction } from "@/store/shop/cart-slice"; // You should create this action to clear redux cart
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const clearCartAfterPayment = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/cart/clear/${user.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            dispatch(clearCartAction()); // Clear cart in Redux store
          } else {
            console.error("Failed to clear cart on server");
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      }
    };

    clearCartAfterPayment();
  }, [dispatch, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 text-center shadow-lg">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-3xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Thank you for your order.</p>
          <Button className="mt-6 w-full" onClick={() => navigate("/shop/account")}>
            View Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
