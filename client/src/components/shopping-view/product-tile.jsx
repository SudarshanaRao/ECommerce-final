import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils"; // assuming you use classnames utility

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm mx-auto overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 animate-fadeIn"
      )}
    >
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative group">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white hover:bg-red-700">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-fuchsia-600 text-white hover:bg-fuchsia-700">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-indigo-600 text-white hover:bg-indigo-700">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 rounded-b-lg">
          <h2 className="text-xl font-bold text-indigo-900 mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-400" : "text-indigo-700"
              } font-semibold`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-pink-600 font-bold">₹{product?.salePrice}</span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 bg-white">
        {product?.totalStock === 0 ? (
          <Button disabled className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-indigo-600 hover:to-fuchsia-500 text-white shadow-lg hover:shadow-fuchsia-500/50 transition-all duration-300"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
