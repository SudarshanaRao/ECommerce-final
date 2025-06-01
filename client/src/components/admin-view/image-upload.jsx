import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/upload-image",
      data
    );
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <motion.div
      className={`w-full mt-6 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Label className="text-xl font-bold text-pink-600 mb-3 block">
        📸 Upload a Cool Image!
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-4 border-dashed rounded-xl p-6 bg-gradient-to-br from-indigo-100 to-pink-100 shadow-md transition duration-300 hover:shadow-xl ${
          isEditMode ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-40 cursor-pointer text-center space-y-2 text-purple-700"
          >
            <UploadCloudIcon className="w-10 h-10 text-purple-500 animate-bounce" />
            <span className="text-md font-semibold">
              Drag & drop or click to upload 🖼️
            </span>
            <p className="text-xs text-gray-500">(Max size: 5MB)</p>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex items-center justify-center h-20">
            <Skeleton className="w-40 h-10 rounded-lg bg-purple-200 animate-pulse" />
          </div>
        ) : (
          <motion.div
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <FileIcon className="w-6 h-6 text-purple-600" />
              <p className="text-sm font-medium text-gray-800">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-5 h-5" />
              <span className="sr-only">Remove</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Optional preview area */}
      <AnimatePresence>
        {uploadedImageUrl && !imageLoadingState && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm font-medium text-gray-600 mb-2">Preview ✨</p>
            <img
              src={uploadedImageUrl}
              alt="Uploaded Preview"
              className="rounded-lg shadow-lg max-h-64 mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProductImageUpload;
