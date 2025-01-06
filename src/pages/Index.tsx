import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-sage-500 bg-sage-50 rounded-full">
            We all Belong
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Compassionate AI-Powered
            <br />
            Mental Health Support
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience personalized support through our AI therapy chat, connect with professionals,
            and join a caring community on your path to wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-sage-400 text-white hover:bg-sage-500 transition-colors duration-200"
            >
              Start Chat Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-sage-300 text-sage-600 hover:bg-sage-50 transition-colors duration-200"
            >
              Explore Resources
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="h-8 w-8 text-sage-400" />,
                title: "AI Therapy Chat",
                description:
                  "24/7 supportive conversations with our AI-powered therapy assistant.",
              },
              {
                icon: <BookOpen className="h-8 w-8 text-sage-400" />,
                title: "Self-Help Resources",
                description:
                  "Access a curated collection of mental health resources and exercises.",
              },
              {
                icon: <Users className="h-8 w-8 text-sage-400" />,
                title: "Community Support",
                description:
                  "Connect with others in a safe, moderated space for shared experiences.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="absolute -top-4 left-6 p-2 bg-cream-50 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">Mental Health Resources</h2>
            <p className="mt-4 text-xl text-gray-600">Discover tools and guidance for your wellness journey</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Guided Meditations",
                description: "Access our library of calming meditation sessions",
                image: "/placeholder.svg",
              },
              {
                title: "Wellness Workshops",
                description: "Join interactive sessions with mental health experts",
                image: "/placeholder.svg",
              },
              {
                title: "Self-Help Guides",
                description: "Explore comprehensive mental wellness resources",
                image: "/placeholder.svg",
              },
            ].map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
            <p className="mt-4 text-xl text-gray-600">Connect with facilitators and peers in a supportive environment</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                  alt="Group therapy session"
                  className="w-full h-64 object-cover"
                />
                <CardHeader>
                  <CardTitle>Group Support Sessions</CardTitle>
                  <CardDescription>
                    Join weekly group sessions led by experienced facilitators in a safe, supportive environment.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="Workshop session"
                  className="w-full h-64 object-cover"
                />
                <CardHeader>
                  <CardTitle>Wellness Workshops</CardTitle>
                  <CardDescription>
                    Participate in interactive workshops focused on mental health education and skill-building.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
