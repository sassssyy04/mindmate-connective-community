import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Community = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h1>
          <p className="text-xl text-gray-600">Connect with others on your mental health journey</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                alt="Group therapy session"
                className="w-full h-64 object-cover"
              />
              <CardHeader>
                <CardTitle>Group Support Sessions</CardTitle>
                <CardDescription>
                  Join our weekly group sessions led by experienced facilitators in a safe,
                  supportive environment. Share experiences, learn coping strategies, and
                  connect with others who understand your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Weekly online meetings</li>
                  <li>Professional facilitators</li>
                  <li>Confidential and supportive space</li>
                  <li>Various time slots available</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                alt="Workshop session"
                className="w-full h-64 object-cover"
              />
              <CardHeader>
                <CardTitle>Wellness Workshops</CardTitle>
                <CardDescription>
                  Participate in our interactive workshops focused on mental health education,
                  skill-building, and personal growth. Learn from experts and connect with
                  peers in a collaborative environment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Monthly themed workshops</li>
                  <li>Expert-led sessions</li>
                  <li>Interactive activities</li>
                  <li>Take-home resources</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Community;