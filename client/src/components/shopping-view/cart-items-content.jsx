import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const [removing, setRemoving] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);

  const getCartItems = cartItems.items || [];
  const product = productList.find((p) => p._id === cartItem?.productId);
  const price = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;

  // Animate price change
  useEffect(() => {
    setPriceChanged(true);
    const timer = setTimeout(() => setPriceChanged(false), 300);
    return () => clearTimeout(timer);
  }, [cartItem.quantity]);

  function handleUpdateQuantity(item, action) {
    if (action === "plus") {
      const cartItemIndex = getCartItems.findIndex((i) => i.productId === item?.productId);
      const currentQuantity = getCartItems[cartItemIndex]?.quantity || 0;
      const totalStock = product?.totalStock || 0;

      if (currentQuantity + 1 > totalStock) {
        toast({
          title: `Only ${currentQuantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: item?.productId,
        quantity: action === "plus" ? item.quantity + 1 : item.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item updated successfully" });
      }
    });
  }

  function handleCartItemDelete(item) {
    setRemoving(true);
    setTimeout(() => {
      dispatch(deleteCartItem({ userId: user?.id, productId: item?.productId })).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Cart item deleted successfully" });
        }
      });
    }, 400);
  }

  return (
    <AnimatePresence>
      {!removing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 100, transition: { duration: 0.4 } }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex items-center space-x-4 p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 bg-white"
        >
          <motion.img
            src={cartItem?.image}
            alt={cartItem?.title}
            className="w-20 h-20 rounded object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="flex-1">
            <h3 className="font-extrabold text-lg">{cartItem?.title}</h3>
            <div className="flex items-center gap-3 mt-2">
              <Button
                as={motion.button}
                variant="outline"
                className="h-8 w-8 rounded-full"
                size="icon"
                disabled={cartItem.quantity === 1}
                onClick={() => handleUpdateQuantity(cartItem, "minus")}
                whileTap={{ scale: 0.8, backgroundColor: "#f87171", color: "white" }}
              >
                <Minus className="w-4 h-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <motion.span
                key={cartItem.quantity}
                initial={{ scale: 0.8, color: "#2563eb" }}
                animate={{ scale: 1, color: "#1e40af" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="font-semibold text-xl"
              >
                {cartItem.quantity}
              </motion.span>
              <Button
                as={motion.button}
                variant="outline"
                className="h-8 w-8 rounded-full"
                size="icon"
                onClick={() => handleUpdateQuantity(cartItem, "plus")}
                whileTap={{ scale: 0.8, backgroundColor: "#34d399", color: "white" }}
              >
                <Plus className="w-4 h-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <motion.p
              key={cartItem.quantity}
              initial={{ scale: 0.9, color: "#ef4444" }}
              animate={
                priceChanged
                  ? { scale: 1.1, color: "#22c55e" }
                  : { scale: 1, color: "black" }
              }
              transition={{ duration: 0.3 }}
              className="font-semibold text-lg"
            >
              ₹{(price * cartItem.quantity).toFixed(2)}
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.3, color: "#ef4444" }}
              whileTap={{ scale: 0.9, color: "#b91c1c" }}
              onClick={() => handleCartItemDelete(cartItem)}
              className="cursor-pointer mt-1"
              role="button"
              aria-label="Delete cart item"
              tabIndex={0}
            >
              <Trash size={20} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserCartItemsContent;
