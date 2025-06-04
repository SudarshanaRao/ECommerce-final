import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { removeWishlistItem } from "@/utils/wishlist-utils"; // keep if you want to use this utility
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function WishlistItem({ item, onRemove }) {
  const { toast } = useToast();

  const handleRemove = () => {
    // Remove from your wishlist utility (if it modifies localStorage or similar)
    removeWishlistItem(item.productId);

    // Update cookie: get existing wishlist from cookie, filter out removed item, set updated cookie
    const cookieWishlist = Cookies.get("wishlist_items");
    if (cookieWishlist) {
      try {
        const parsed = JSON.parse(cookieWishlist);
        const updated = parsed.filter(
          (wishlistItem) => wishlistItem.productId !== item.productId
        );
        Cookies.set("wishlist_items", JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to update wishlist cookie", error);
      }
    }

    toast({ title: "Removed from wishlist" });
    onRemove?.(item.productId);
  };

  return (
    <motion.div
      layout
      className="flex items-start sm:items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
    >
      {/* Image & Info */}
      <div className="flex items-start gap-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 rounded-md object-cover border"
        />
        <div className="flex flex-col">
          <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
          <p className="text-sm font-medium text-purple-600 mt-1">
            ₹{item.salePrice && item.salePrice !== 0 ? item.salePrice : item.price}

          </p>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="text-red-500 hover:bg-red-100"
        aria-label="Remove from wishlist"
      >
        <Trash className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}
