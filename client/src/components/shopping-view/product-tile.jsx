import React, { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { addWishlistItem, removeWishlistItem } from "@/utils/wishlist-utils";

function ShoppingProductTile({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(product.price);
  const [selectedSalePrice, setSelectedSalePrice] = useState(product.salePrice || null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!product?._id) return;
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist_items") || "[]");
      const exists = wishlist.some((item) => item.productId === product._id);
      setIsWishlisted(exists);
    } catch (err) {
      console.error("Failed to parse wishlist:", err);
      setIsWishlisted(false);
    }
  }, [product?._id]);

  // On product or sizes change, set default selected size and price
  useEffect(() => {
    if (!product?.sizes) return;

    const sizeEntries = Object.entries(product.sizes);

    const sizeWithPrices = sizeEntries
      .filter(([_, info]) => info && (info.salePrice || info.price || info.salePrice === 0))
      .map(([size, info]) => {
        const hasValidSale = info.salePrice && info.salePrice > 0;
        const finalPrice = hasValidSale ? info.salePrice : info.price;

        return {
          size,
          price: info.price,
          salePrice: hasValidSale ? info.salePrice : null,
          finalPrice,
        };
      });

    if (sizeWithPrices.length > 0) {
      const sorted = sizeWithPrices.sort((a, b) => a.finalPrice - b.finalPrice);
      const defaultSize = sorted[0];
      setSelectedSize(defaultSize.size);
      setSelectedPrice(defaultSize.price);
      setSelectedSalePrice(defaultSize.salePrice);
    } else {
      // No sizes, fallback to product price
      setSelectedPrice(product.price);
      setSelectedSalePrice(product.salePrice || null);
      setSelectedSize("");
    }
  }, [product]);

  function handleAddToCart(productId) {
    if (!productId) return;

    const category = product?.category?.toLowerCase();
    const requiresSize = ["men", "women", "footwear"].includes(category);

    if (requiresSize && !selectedSize) {
      toast({
        title: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    // Extract size-specific details
    const sizeDetails = requiresSize ? product?.sizes?.[selectedSize] : null;

    const price = sizeDetails?.price ?? product?.price ?? 0;
    const salePrice = sizeDetails?.salePrice ?? product?.salePrice ?? 0;
    const availableQuantity = sizeDetails?.stock ?? product?.totalStock ?? 0;

    const currentCartItems = cartItems?.items || [];
    const existingItem = currentCartItems.find(
      (item) =>
        item.productId === productId &&
        (!requiresSize || item.size === selectedSize)
    );

    if (existingItem && existingItem.quantity + 1 > availableQuantity) {
      toast({
        title: `Only ${availableQuantity} in stock${requiresSize ? ` for size ${selectedSize}` : ""}`,
        variant: "destructive",
      });
      return;
    }

    const payload = {
      userId: user?.id,
      productId,
      quantity: 1,
      price,
      salePrice,
      ...(requiresSize && { size: selectedSize }),
    };

    dispatch(addToCart(payload)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  const toggleWishlist = () => {
    if (!product?._id) return;
    if (isWishlisted) {
      removeWishlistItem(product._id);
      toast({ description: "Removed from wishlist" });
    } else {
      addWishlistItem({ productId: product._id, ...product });
      toast({ description: "Added to wishlist" });
    }
    setIsWishlisted(!isWishlisted);
  };

  const discountPercent = selectedPrice && selectedSalePrice
    ? Math.round(((selectedPrice - selectedSalePrice) / selectedPrice) * 100)
    : null;

  // Calculate stock for display (simple fallback)
  const stock = (() => {
    const category = product?.category?.toLowerCase();
    if (["men", "women", "footwear"].includes(category)) {
      return product?.sizes?.[selectedSize]?.stock ?? 0;
    }
    return product?.totalStock ?? 0;
  })();


  return (
    <div
      className="relative border rounded-lg p-4 shadow-lg flex flex-col gap-4 max-w-xs
        bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out
        min-h-[420px]"
    >
      {/* Discount Badge */}
      {discountPercent && (
        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-lg">
          {discountPercent}% OFF
        </span>
      )}

      {/* Product Image */}
      <div className="flex justify-center items-center h-48 overflow-hidden rounded-md bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 truncate" title={product.title}>
        {product.title}
      </h2>

      {/* Size Selection */}
      {product?.sizes && ["men", "women", "footwear"].includes(product.category?.toLowerCase()) && (
        <div className="flex gap-3 mt-1 flex-wrap">
          {["S", "M", "L", "XL"].map((size) => {
            const stockForSize = product.sizes?.[size]?.stock ?? 0;
            const isOutOfStock = stockForSize === 0;

            return (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => {
                  if (isOutOfStock) return;
                  setSelectedSize(size);
                  const sizeInfo = product.sizes?.[size];
                  setSelectedPrice(sizeInfo?.price ?? null);
                  setSelectedSalePrice(sizeInfo?.salePrice ?? null);
                }}
                disabled={isOutOfStock}
                className={`min-w-[40px] px-2 py-1 rounded-md text-sm
                  ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {size}
              </Button>
            );
          })}
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-2 mt-2">
        {selectedSalePrice ? (
          <>
            <p className="text-xl font-bold line-through text-gray-400">
              ₹{selectedPrice}
            </p>
            <p className="text-xl font-extrabold text-green-600">
              ₹{selectedSalePrice}
            </p>
          </>
        ) : (
          <p className="text-xl font-extrabold text-gray-900">₹{selectedPrice}</p>
        )}
      </div>

      {/* Stock & Actions */}
      <div className="flex gap-3 mt-auto">
        <Button
          className="flex-1"
          onClick={() => handleAddToCart(product._id)}
          disabled={stock === 0}
          title={stock === 0 ? "Out of Stock" : "Add to Cart"}
        >
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>

        <Button
          variant={isWishlisted ? "secondary" : "outline"}
          onClick={toggleWishlist}
          className="flex items-center gap-2 p-2"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? <HeartOff className="w-5 h-5 text-red-600" /> : <Heart className="w-5 h-5 text-gray-600" />}
        </Button>
      </div>
    </div>
  );
}

export default ShoppingProductTile;
