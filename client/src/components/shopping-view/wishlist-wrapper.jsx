import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // <-- Import Cookies
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserWishlistItems from "./wishlist-items-content";

export default function WishlistWrapper({ setOpenWishlistSheet }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [items, setItems] = useState([]); // Renamed from wishlistItems to items
  

  useEffect(() => {
  setAnimateIn(true);

  const checkCookie = () => {
    const cookieWishlist = Cookies.get("wishlist_items");
    if (cookieWishlist) {
      try {
        const parsedItems = JSON.parse(cookieWishlist);
        setItems((prevItems) => {
          // Only update if changed
          return JSON.stringify(prevItems) !== JSON.stringify(parsedItems)
            ? parsedItems
            : prevItems;
        });
      } catch (e) {
        console.error("Failed to parse wishlist cookie", e);
      }
    }
  };

  checkCookie(); // Initial run

  const interval = setInterval(checkCookie, 1000); // Check every 1s

  return () => clearInterval(interval); // Cleanup
}, []);


  return (
    <SheetContent
      side="right"
      className={`sm:max-w-md bg-white p-6 rounded-lg shadow-md text-gray-900 transform transition-all duration-700 ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Header */}
      <SheetHeader
        className='bg-gray-900 p-4 mt-5 rounded-md mb-6 shadow-md border border-purple-400'
      >
        <SheetTitle className="text-3xl font-bold tracking-wide text-purple-200">
          Your Wishlist
        </SheetTitle>
      </SheetHeader>

      {/* Wishlist Items */}
      <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.productId || item._id} className="animate-fade-in-up">
              <UserWishlistItems item={item} onRemove={(removedProductId) => {
                setItems((prev) => prev.filter(i => i.productId !== removedProductId));
              }} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No items in wishlist</p>
        )}
      </div>
    </SheetContent>
  );
}
