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
        </div>

        <CardContent className="p-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center">
            <span
              className={`text-lg font-medium ${
                product?.salePrice > 0
                  ? "line-through text-gray-500"
                  : "text-blue-600"
              }`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-xl font-bold text-green-600 animate-pulse">
                ₹{product?.salePrice}
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
