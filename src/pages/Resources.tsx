import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Resources = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mental Health Resources</h1>
          <p className="text-xl text-gray-600">Discover tools and guidance for your wellness journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Guided Meditations",
              description: "Access our library of calming meditation sessions for stress relief and mindfulness practice.",
              image: "/placeholder.svg",
              category: "Meditation"
            },
            {
              title: "Wellness Workshops",
              description: "Join interactive sessions with mental health experts to learn coping strategies and self-care techniques.",
              image: "/placeholder.svg",
              category: "Education"
            },
            {
              title: "Self-Help Guides",
              description: "Explore comprehensive guides on various mental health topics, from anxiety management to building resilience.",
              image: "/placeholder.svg",
              category: "Self-Help"
            },
            {
              title: "Mood Tracking Tools",
              description: "Track your emotional well-being with our intuitive mood tracking tools and journaling prompts.",
              image: "/placeholder.svg",
              category: "Tools"
            },
            {
              title: "Crisis Support",
              description: "Access immediate support resources and crisis hotlines available 24/7.",
              image: "/placeholder.svg",
              category: "Support"
            },
            {
              title: "Community Forums",
              description: "Connect with others in moderated discussion forums focused on mental health support and recovery.",
              image: "/placeholder.svg",
              category: "Community"
            }
          ].map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-sage-50 text-sage-600 rounded-full text-sm">
                      {resource.category}
                    </span>
                  </div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="w-full px-4 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors duration-200">
                    Access Resource
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;