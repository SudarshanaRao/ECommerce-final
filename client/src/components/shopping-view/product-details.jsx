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

  if (["men", "women"].includes(productDetails?.category?.toLowerCase()) && !selectedSize) {
    toast({
      title: "Please select a size before adding to cart.",
      variant: "destructive",
    });
    return;
  }

  const currentCartItems = cartItems?.items || [];
  const existingItem = currentCartItems.find(
    (item) => item.productId === productId && item.size === selectedSize
  );

  if (existingItem && existingItem.quantity + 1 > totalStock) {
    toast({
      title: `Only ${existingItem.quantity} quantity can be added for this size`,
      variant: "destructive",
    });
    return;
  }

  dispatch(
    addToCart({
      userId: user?.id,
      productId,
      quantity: 1,
      size: selectedSize || "Free Size", // default fallback
    })
  ).then((data) => {
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

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid max-h-[85vh] overflow-y-auto grid-cols-2 gap-8 bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-150 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
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
                    {["S", "M", "L", "XL"].map((size) => (
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
            }
            return null;
          })()}
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ₹{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">
                ₹{productDetails?.salePrice}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <StarRatingComponent rating={averageReview} />
            <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
          </div>

          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(productDetails?._id, productDetails?.totalStock)
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
