import { Heart, HeartOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addWishlistItem, removeWishlistItem } from "@/utils/wishlist-utils";
function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedSalePrice, setSelectedSalePrice] = useState(null);

  const totalSizesStock = productDetails?.sizes
  ? Object.values(productDetails.sizes).reduce(
      (sum, sizeInfo) => sum + (sizeInfo?.stock || 0),
      0
    )
  : 0;


  useEffect(() => {
  if (!productDetails?._id) return;
  
  try {
    const wishlist = JSON.parse(localStorage.getItem("wishlist_items") || "[]");
    const exists = wishlist.some((item) => item.productId === productDetails._id);
    setIsWishlisted(exists);
  } catch (err) {
    console.error("Failed to parse wishlist:", err);
    setIsWishlisted(false);
  }
}, [productDetails?._id]);

useEffect(() => {
  if (!productDetails?.sizes) return;

  const sizeEntries = Object.entries(productDetails.sizes);

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
  }
}, [productDetails]);

  function handleRatingChange(newRating) {
    setRating(newRating);
  }

  const toggleWishlist = () => {
    if (!productDetails?._id) return;
    if (isWishlisted) {
      removeWishlistItem(productDetails._id);
      toast({ description: "Removed from wishlist" });
    } else {
      addWishlistItem({ productId: productDetails._id, ...productDetails });
      toast({ description: "Added to wishlist" });
    }
    setIsWishlisted(!isWishlisted);
  };

  function handleAddToCart(productId, totalStock) {
  if (!productId) return;

  const category = productDetails?.category?.toLowerCase();
  const requiresSize = ["men", "women", "footwear"].includes(category);

  if (requiresSize && !selectedSize) {
    toast({
      title: "Please select a size before adding to cart.",
      variant: "destructive",
    });
    return;
  }

  // Extract size-specific details
  const sizeDetails = requiresSize ? productDetails?.sizes?.[selectedSize] : null;

  const price = sizeDetails?.price ?? productDetails?.price ?? 0;
  const salePrice = sizeDetails?.salePrice ?? productDetails?.salePrice ?? 0;
  const availableQuantity = sizeDetails?.stock ?? totalStock ?? 0;

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




  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails(null));
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!rating || reviewMsg.trim() === "") return;

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  const discountPercent = selectedPrice && selectedSalePrice
  ? Math.round(((selectedPrice - selectedSalePrice) / selectedPrice) * 100)
  : null;

  useEffect(() => {
  const category = productDetails?.category?.toLowerCase();

  if (!productDetails) return;

  if (category !== "men" && category !== "women" && category !== "skincare") {
    const sizesObj = productDetails.sizes;
    
    if (sizesObj && Object.keys(sizesObj).length > 0) {
      const sizeWithPrices = Object.entries(sizesObj)
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
        return;
      }
    }

    // Fallback: no sizes
    setSelectedPrice(productDetails.price ?? null);
    setSelectedSalePrice(productDetails.salePrice ?? null);
  }
}, [productDetails]);


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid max-h-[85vh] overflow-y-auto grid-cols-2 gap-8 bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-150 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          {/* Discount Tag (Top Right) */}
          {discountPercent && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
              {discountPercent}% OFF
            </span>
          )}

          {/* Stock Info Tag (Top Left) */}
          {(() => {
            const stock = productDetails?.sizes?.[selectedSize]?.stock || 0;
            if (stock === 5) {
              return (
                <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full z-10">
                  Few stocks left..!
                </span>
              );
            }
            if (stock < 10 && stock > 0) {
              return (
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  Hurry, Selling Fast..!
                </span>
              );
            }
            return null;
          })()}

          <img
            src={productDetails?.image}
            alt={productDetails?.title || "Product Image"}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <div>
            <h1 className="text-2xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-l mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>

          {(() => {
            const category = productDetails?.category?.toLowerCase();

            if (["men", "women"].includes(category)) {
              return (
                <div className="mb-4">
                  <Label className="mb-2 block text-sm font-semibold">Select Size:</Label>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map((size) => {
                      const stock = productDetails.sizes?.[size]?.stock ?? 0;
                      const isOutOfStock = stock === 0;

                      return (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          onClick={() => {
                            if (isOutOfStock) return;
                            setSelectedSize(size);
                            const sizeInfo = productDetails.sizes?.[size];
                            setSelectedPrice(sizeInfo?.price ?? null);
                            setSelectedSalePrice(sizeInfo?.salePrice ?? null);
                          }}
                          disabled={isOutOfStock}
                          className={isOutOfStock ? "out-of-stock" : ""}
                        >
                          {size}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            } else if (category === "skincare") {
              const skincareSizes = ["10ml", "30ml", "100ml", "500ml"];
              return (
                <div className="mb-4">
                  <Label className="mb-2 block text-sm font-semibold">Select Size:</Label>
                  <div className="flex gap-2">
                    {skincareSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          selectedSize === size ? "bg-purple-600 text-white" : "hover:bg-purple-100"
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            } return null;
          })()}

          <div className="flex items-center justify-between mt-4">
            {selectedSalePrice ? (
              <>
                <p className="text-3xl font-bold text-primary line-through">
                  ₹{selectedPrice}
                </p>
                <p className="text-2xl font-bold text-muted-foreground">
                  ₹{selectedSalePrice}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-primary">₹{selectedPrice}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StarRatingComponent rating={averageReview} />
            <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
          </div>

          <div className="mt-5 mb-5">
            {(productDetails?.sizes?.[selectedSize || "Free Size"]?.stock || 0) === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed" disabled>
                Out of Stock
              </Button>

            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.sizes?.[selectedSize || "Free Size"]?.stock || 0
                  )

                }
              >
                Add to Cart
              </Button>
            )}

            <Button
              onClick={toggleWishlist}
              variant={isWishlisted ? "secondary" : "outline"}
              className={`w-full mt-4 flex items-center gap-2 transition-colors ${
                isWishlisted
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "hover:bg-purple-50"
              }`}
            >
              {isWishlisted ? (
                <>
                  <HeartOff className="w-5 h-5" />
                  <span>Remove from Wishlist</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>Add to Wishlist</span>
                </>
              )}
            </Button>
          </div>

          <Separator />

          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div key={reviewItem._id || index} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue || 0} />
                      </div>
                      <p className="text-muted-foreground">{reviewItem.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-2">
              <Label>Write a review</Label>
              <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button onClick={handleAddReview} disabled={!rating || reviewMsg.trim() === ""}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
