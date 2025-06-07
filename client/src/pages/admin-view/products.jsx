import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { addProductFormElements } from "@/config";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { toast } = useToast();

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const genderCategories = ["men", "women"];
  const availableSizes = ["S", "M", "L", "XL", "XXL", "FREE SIZE"];
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sizeDetails, setSizeDetails] = useState({});

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSizeDetailChange = (size, field, value) => {
    setSizeDetails((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        [field]: value,
      },
    }));
  };

  const isSizesValid = () => {
  if (!genderCategories.includes(formData.category.toLowerCase())) return true; // sizes not required for other categories

  if (selectedSizes.length === 0) return false; // sizes required for men/women

  return selectedSizes.every((size) => {
    const detail = sizeDetails[size];
    return (
      detail &&
      detail.stock !== undefined &&
      detail.price !== undefined &&
      detail.stock !== "" &&
      detail.price !== "" &&
      !isNaN(Number(detail.stock)) &&
      !isNaN(Number(detail.price))
    );
  });
};

const isFormValid = () => {
  const requiredFields = ["title", "description", "category", "brand"];
  const allRequiredFilled = requiredFields.every(
    (key) => formData[key] && formData[key].trim() !== ""
  );

  const isPriceValid =
    formData.price !== "" && !isNaN(Number(formData.price));
  const isTotalStockValid =
    formData.totalStock !== "" && !isNaN(Number(formData.totalStock));

  const hasImage = formData.image || uploadedImageUrl;

  return (
    allRequiredFilled &&
    isPriceValid &&
    isTotalStockValid &&
    hasImage &&
    isSizesValid()
  );
};



  const onSubmit = (event) => {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetFormState();
        }
      });
    } else {
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl, sizes: sizeDetails }))
        .then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetFormState();
            toast({ title: "🎉 Product added successfully!" });
          }
        });
    }
  };

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "🗑️ Product deleted" });
      }
    });
  };

  const resetFormState = () => {
    setOpenCreateProductsDialog(false);
    setFormData(initialFormData);
    setCurrentEditedId(null);
    setImageFile(null);
    setSelectedSizes([]);
    setSizeDetails({});
  };

  return (
    <Fragment>
      <motion.div
        className="mb-6 flex justify-end items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="flex items-center gap-2 text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition-transform duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Product ✨
        </Button>
      </motion.div>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {productList?.map((productItem, index) => (
          <AdminProductTile
            key={`${productItem.id}-${index}`}
            product={productItem}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            handleDelete={handleDelete}
          />
        ))}
      </motion.div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) resetFormState();
        }}
      >
        <SheetContent
  side="right"
  className="overflow-auto bg-white/90 backdrop-blur-lg shadow-2xl"
>
  <SheetHeader>
    <SheetTitle className="text-xl font-semibold text-indigo-700">
      {currentEditedId !== null ? "📝 Edit Product" : "🆕 Add New Product"}
    </SheetTitle>
  </SheetHeader>

  <div className="mt-6">
    <ProductImageUpload
      imageFile={imageFile}
      setImageFile={setImageFile}
      uploadedImageUrl={uploadedImageUrl}
      setUploadedImageUrl={setUploadedImageUrl}
      setImageLoadingState={setImageLoadingState}
      imageLoadingState={imageLoadingState}
      isEditMode={currentEditedId !== null}
    />
  </div>

  {/* 👇 Move Sizes section above the form */}
  {genderCategories.includes(formData.category.toLowerCase()) && (
    <div className="space-y-4 px-2 mt-6">
      <p className="text-lg font-semibold text-indigo-600">Select Sizes</p>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleSizeChange(size)}
            className={`border rounded-full px-4 py-1 text-sm ${
              selectedSizes.includes(size)
                ? "bg-indigo-600 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {selectedSizes.map((size) => (
        <div
          key={size}
          className="border rounded p-4 mt-4 bg-gray-50 shadow-sm"
        >
          <p className="font-semibold text-indigo-700 mb-2">Size: {size}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Total Stock</label>
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                value={sizeDetails[size]?.stock || ""}
                onChange={(e) =>
                  handleSizeDetailChange(size, "stock", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                value={sizeDetails[size]?.price || ""}
                onChange={(e) =>
                  handleSizeDetailChange(size, "price", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Sale Price</label>
              <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                value={sizeDetails[size]?.salePrice || ""}
                onChange={(e) =>
                  handleSizeDetailChange(size, "salePrice", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* 👇 CommonForm moved after Sizes section */}
  <div className="py-6">
    <CommonForm
      onSubmit={onSubmit}
      formData={formData}
      setFormData={setFormData}
      buttonText={currentEditedId !== null ? "Update 🚀" : "Add 🎯"}
      formControls={addProductFormElements}
      isBtnDisabled={!isFormValid()}
    />
  </div>
</SheetContent>

      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
