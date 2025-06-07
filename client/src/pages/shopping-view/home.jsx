import { Button } from "@/components/ui/button";
import {
  Pipette,
  ChevronLeftIcon,
  ChevronRightIcon,
  Sparkles,
  ShirtIcon,
  Footprints,
  WatchIcon,
} from "lucide-react";
import ZaraLogo from '../../assets/zara-logo.png'
import NikeLogo from '../../assets/nike_logo.png'
import AdidasLogo from '../../assets/adidas_logo.png'
import PumaLogo from '../../assets/puma_logo.png'
import LevisLogo from '../../assets/levis_logo.png'
import HMLogo from '../../assets/hm_logo.png'
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import FinStoreLogo from "../../assets/finstore_logo.png";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Sparkles },
  { id: "skincare", label: "Skincare", icon: Pipette },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: NikeLogo },
  { id: "adidas", label: "Adidas", icon: AdidasLogo },
  { id: "puma", label: "Puma", icon: PumaLogo },
  { id: "levi", label: "Levi's", icon: LevisLogo },
  { id: "zara", label: "Zara", icon: ZaraLogo },
  { id: "h&m", label: "H&M", icon: HMLogo },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // console.log("Otp : ", localStorage.getItem("otp"));
  

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);


  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem, index) => (
              <Card
                key={categoryItem.label || index}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-purple-100">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-12 tracking-wide animate-fade-in">
      ✨ Shop by Brand ✨
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {brandsWithIcon.map((brandItem, index) => (
        <Card
          key={brandItem.label || index}
          onClick={() => handleNavigateToListingPage(brandItem, "brand")}
          className="cursor-pointer transition-transform hover:scale-105 bg-white bg-opacity-40 backdrop-blur-lg border border-purple-100 shadow-xl rounded-2xl"
        >
          <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
            <img
              src={brandItem.icon}
              alt={brandItem.label}
              className="w-16 h-16 object-contain rounded-full animate-spin-slow shadow-md"
            />
            <span className="font-semibold text-purple-700 text-center text-sm">
              {brandItem.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


      <section className="relative py-12 bg-gradient-to-br from-purple-50 via-white to-purple-100">
  <div className="container mx-auto px-4 relative">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-extrabold text-purple-800 tracking-tight flex items-center gap-2 animate-fade-in">
        <Sparkles className="text-purple-600 animate-bounce" /> Featured Products
      </h2>
      <Button
        onClick={() => navigate("/shop/listing")}
        className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300"
      >
        Show More →
      </Button>
    </div>

    <div className="relative group">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.getElementById("feature-scroll").scrollBy({ left: -300, behavior: 'smooth' })}
          className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-purple-100 transition hidden group-hover:flex"
        >
          <ChevronLeftIcon className="w-5 h-5 text-purple-800" />
        </Button>

        <div
          id="feature-scroll"
          className="overflow-x-auto no-scrollbar scroll-smooth flex gap-4 pr-6 pl-12 py-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {productList
            ?.filter((productItem) => {
              const category = productItem.category?.toLowerCase();

              if (["men", "women", "footwear"].includes(category)) {
                // Check if any size has stock > 0
                return Object.values(productItem.sizes || {}).some(
                  (sizeObj) => sizeObj?.stock > 0
                );
              }

              // For other categories, check totalStock
              return productItem.totalStock > 0;
            })
            .slice(0, 8)
            .map((productItem, index) => (
              <div
                key={productItem._id || index}
                className="min-w-[260px] snap-start scroll-ml-4 flex-shrink-0 transition-transform hover:-translate-y-2 duration-300"
              >
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              </div>
          ))}

        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.getElementById("feature-scroll").scrollBy({ left: 300, behavior: 'smooth' })}
          className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-purple-100 transition hidden group-hover:flex"
        >
          <ChevronRightIcon className="w-5 h-5 text-purple-800" />
        </Button>
      </div>
    </div>
  </div>
</section>


      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
