import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {

  // Step 1: Compute lowest price/salePrice and the size label
let price = product.price;
let salePrice = product.salePrice;
let lowestSizeLabel = "FreeSize";

if (["men", "women"].includes(product.category) && product.sizes) {
  const sizeEntries = Object.entries(product.sizes);

  let minPrice = Infinity;
  let minSalePrice = Infinity;

  for (const [sizeLabel, sizeData] of sizeEntries) {
    if (sizeData.price < minPrice) {
      minPrice = sizeData.price;
    }
    if (sizeData.salePrice > 0 && sizeData.salePrice < minSalePrice) {
      minSalePrice = sizeData.salePrice;
      lowestSizeLabel = sizeLabel;
    }
  }

  price = minPrice;
  salePrice = minSalePrice !== Infinity ? minSalePrice : 0;
}

const hasDiscount = salePrice > 0 && price > salePrice;
const discountPercentage = hasDiscount
  ? Math.round(((price - salePrice) / price) * 100)
  : 0;


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="w-full max-w-sm mx-auto shadow-2xl rounded-2xl border border-gray-200 overflow-hidden backdrop-blur-md bg-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:scale-[1.02] duration-300">
        <div className="relative group">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover transform group-hover:scale-105 transition duration-300"
          />

          {hasDiscount && (
            <div
              title={`Lowest price for size ${lowestSizeLabel.toUpperCase()}`}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10"
            >
              {discountPercentage}% OFF
            </div>
          )}

        </div>

        <CardContent className="p-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center">
            <span
              className={`text-lg font-medium ${
                hasDiscount ? "line-through text-gray-500" : "text-blue-600"
              }`}
            >
              ₹{price}
            </span>
            {hasDiscount && (
              <span className="text-xl font-bold text-green-600 animate-pulse">
                ₹{salePrice}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between px-5 py-4 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className=" bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg transition duration-300"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg shadow-lg transition duration-300"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}


export default AdminProductTile;
