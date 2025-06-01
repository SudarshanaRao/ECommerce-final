import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles, ImagePlus } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6 flex items-center justify-center gap-2">
          <Sparkles className="text-purple-500" /> Admin Image Manager 🎨
        </h1>

        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="mt-5"
        >
          <Button
            onClick={handleUploadFeatureImage}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <ImagePlus className="mr-2" />
            Upload Feature Image 🚀
          </Button>
        </motion.div>
      </motion.div>

      {/* Gallery */}
      <motion.div
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.3, staggerChildren: 0.1 } },
        }}
      >
        {featureImageList?.length > 0 &&
          featureImageList.map((featureImgItem, index) => (
            <motion.div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg bg-white hover:scale-105 transform transition duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={featureImgItem.image}
                alt={`Feature ${index}`}
                className="h-[250px] w-full object-cover"
              />
              <div className="p-4 text-center font-semibold text-indigo-600">
                ✨ Featured Image #{index + 1}
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Bonus Section for Cool Stuff */}
      <div className="mt-16 text-center text-lg text-gray-600">
        Want to add cool stuff? Try uploading <span className="font-bold">GIFs 🖼️</span>, add text overlays, or drop <span className="font-bold">fun stickers 🎉</span> soon!
      </div>
    </div>
  );
}

export default AdminDashboard;
