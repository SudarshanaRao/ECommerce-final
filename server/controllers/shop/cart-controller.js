const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size, price, salePrice } = req.body;
    

if (!userId || !productId || quantity <= 0) {
  return res.status(400).json({ success: false, message: "Invalid data provided!" });
}

const product = await Product.findById(productId);

if (!product) {
  return res.status(404).json({ success: false, message: "Product not found" });
}

const hasSizes = product.sizes && product.sizes.size > 0; // check if sizes Map exists

if (hasSizes) {
  if (!size) {
    return res.status(400).json({ success: false, message: "Size is required for this product" });
  }
  
  const sizeInfo = product.sizes.get(size);
  
  if (!sizeInfo) {
    return res.status(400).json({ success: false, message: "Selected size not available" });
  }
  
  if (sizeInfo.stock < quantity) {
    return res.status(400).json({ success: false, message: "Not enough stock for selected size" });
  }
} else {
  // No sizes: check totalStock for accessories or no-size products
  if (product.totalStock < quantity) {
    return res.status(400).json({ success: false, message: "Not enough stock available" });
  }
}

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
  (item) =>
    item.productId.toString() === productId &&
    ((item.size || null) === (size || null))
);


    if (findCurrentProductIndex === -1) {
  cart.items.push({
  productId,
  quantity,
  size: size || null,
  price,
  salePrice,
  title: product.title,
  image: product.image,
});

} else {
  cart.items[findCurrentProductIndex].quantity += quantity;
}
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title", // Only fetching what is needed from Product
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Remove invalid items (productId missing or deleted)
    const validItems = cart.items.filter(item => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populatedCartItems = cart.items.map((item) => {
      const product = item.productId;

      return {
        productId: product._id,
        image: product.image || null,
        title: product.title || "Product not found",
        price: item.price,
        salePrice: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
        size: item.size,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the cart.",
    });
  }
};



const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => {
  const product = item.productId;
  if (!product) {
    return {
      productId: null,
      image: null,
      title: "Product not found",
      price: null,
      salePrice: null,
      quantity: item.quantity,
    };
  }

  // Default price and salePrice from product
  let price = product.price;
  let salePrice = product.salePrice;

  // If salePrice is missing on product and sizes exist, get from size
  if (
    (!salePrice || salePrice === 0) && // or however you define missing
    product.sizes &&
    item.size &&
    product.sizes.get(item.size)
  ) {
    const sizeDetails = product.sizes.get(item.size);
    salePrice = sizeDetails.salePrice || null;
    price = sizeDetails.price || price; // fallback to product.price if size.price missing
  }

  return {
    productId: product._id,
    image: product.image,
    title: product.title,
    price,
    salePrice,
    quantity: item.quantity,
    size: item.size, // if you want to send size also
  };
});


    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = []; // Clear all items
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
    });
  }
};


module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
  clearCart,
};
