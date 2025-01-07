import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
    >
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-tribe-blue bg-blue-50 rounded-full">
        We all Belong
      </span>
      <h1 className="text-4xl md:text-6xl font-bold text-tribe-grey mb-6">
        Creating spaces where everyone
        <br />
        feels seen and valued
      </h1>
      <p className="text-xl text-tribe-grey mb-8 max-w-2xl mx-auto">
        Experience personalized support through our AI therapy chat, connect with professionals,
        and join a caring community on your path to wellness.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/chat"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-tribe-blue text-white hover:bg-blue-600 transition-colors duration-200"
        >
          Start Chat Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link
          to="/resources"
          className="inline-flex items-center px-6 py-3 rounded-lg border border-tribe-mint text-tribe-blue hover:bg-blue-50 transition-colors duration-200"
        >
          Explore Resources
        </Link>
      </div>
    </motion.div>
  );
};