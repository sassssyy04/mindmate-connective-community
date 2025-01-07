import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Users } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-tribe-blue" />,
      title: "AI Therapy Chat",
      description: "24/7 supportive conversations with our AI-powered therapy assistant.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-tribe-mint" />,
      title: "Self-Help Resources",
      description: "Access a curated collection of mental health resources and exercises.",
    },
    {
      icon: <Users className="h-8 w-8 text-tribe-green" />,
      title: "Community Support",
      description: "Connect with others in a safe, moderated space for shared experiences.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="absolute -top-4 left-6 p-2 bg-white rounded-lg shadow-sm">
              {feature.icon}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-tribe-grey mb-2">
              {feature.title}
            </h3>
            <p className="text-tribe-grey">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};