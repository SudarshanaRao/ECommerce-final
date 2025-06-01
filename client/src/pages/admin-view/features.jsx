import { motion } from "framer-motion";
import { BadgeCheck, Settings } from "lucide-react";

function AdminFeatures() {
  const features = [
    { icon: <BadgeCheck className="text-green-500" />, title: "Verified Products", description: "Only verified listings are allowed 🚀" },
    { icon: <Settings className="text-indigo-500" />, title: "Easy Configuration", description: "Control everything from one place ⚙️" },
    { icon: <img src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif" alt="Fun" className="w-6 h-6" />, title: "Animated GIF Support", description: "Spice up your dashboard with gifs 🎉" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/50">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10 flex items-center justify-center gap-2">
          <Settings className="text-purple-500" />
          Admin Features Dashboard 🌟
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-4 flex justify-center">{feature.icon}</div>
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          More cool features coming soon! 🚧 Stay tuned...
        </div>
      </div>
    </motion.div>
  );
}

export default AdminFeatures;
