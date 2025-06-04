import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent
      className={`sm:max-w-md bg-white p-6 rounded-lg shadow-md text-gray-900 transform transition-transform duration-700 ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <SheetHeader
        className={`bg-gray-800 p-4 mt-5 rounded-md mb-6 shadow-md ${
          animateIn ? "animate-border-fade" : ""
        }`}
        style={{
          border: "1px solid rgba(128, 90, 220, 0.4)",
        }}
      >
        <SheetTitle className="text-3xl font-extrabold tracking-wide text-purple-400 animate-pulse-soft">
          Your Cart
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="animate-fade-in-up"
            >
              <UserCartItemsContent cartItem={item} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic font-semibold mt-10 tracking-wide">
            Your cart is empty.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-4 border-t border-gray-300 pt-4">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>₹{totalCartAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white font-semibold py-3 rounded-lg shadow-md transition-transform duration-150 active:scale-95 border border-purple-500"
        disabled={cartItems.length === 0}
        style={{
          boxShadow: animateIn
            ? "0 4px 12px rgba(128, 90, 220, 0.5)"
            : "none",
        }}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
