import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleBooking = (eventType: string) => {
    toast({
      title: "Coming Soon",
      description: `Booking for ${eventType} will be available soon!`,
    });
  };

  const groupSessions = [
    {
      title: "Anxiety Support Group",
      time: "Mondays at 7:00 PM",
      facilitator: "Dr. Sarah Johnson",
      spots: "5 spots remaining",
    },
    {
      title: "Stress Management Circle",
      time: "Wednesdays at 6:30 PM",
      facilitator: "Dr. Michael Chen",
      spots: "3 spots remaining",
    },
  ];

  const workshops = [
    {
      title: "Mindfulness Meditation Workshop",
      date: "Next Saturday at 10:00 AM",
      instructor: "Lisa Thompson",
      duration: "90 minutes",
    },
    {
      title: "Emotional Intelligence Workshop",
      date: "Next Sunday at 2:00 PM",
      instructor: "Dr. James Wilson",
      duration: "2 hours",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Hero Section */}
      <div className="pt-24 pb-16">
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

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="h-8 w-8 text-tribe-blue" />,
                title: "AI Therapy Chat",
                description:
                  "24/7 supportive conversations with our AI-powered therapy assistant.",
              },
              {
                icon: <BookOpen className="h-8 w-8 text-tribe-mint" />,
                title: "Self-Help Resources",
                description:
                  "Access a curated collection of mental health resources and exercises.",
              },
              {
                icon: <Users className="h-8 w-8 text-tribe-green" />,
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

        {/* Resources Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-tribe-grey">Mental Health Resources</h2>
            <p className="mt-4 text-xl text-tribe-grey">Discover tools and guidance for your wellness journey</p>
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
                    <CardTitle className="text-tribe-grey">{resource.title}</CardTitle>
                    <CardDescription className="text-tribe-grey">{resource.description}</CardDescription>
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
            <h2 className="text-3xl font-bold text-tribe-grey">Join Our Community</h2>
            <p className="mt-4 text-xl text-tribe-grey">Connect with facilitators and peers in a supportive environment</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <img
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                      alt="Group therapy session"
                      className="w-full h-64 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="text-tribe-grey">Group Support Sessions</CardTitle>
                      <CardDescription className="text-tribe-grey">
                        Join weekly group sessions led by experienced facilitators in a safe, supportive environment.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Available Group Sessions</DialogTitle>
                  <DialogDescription>
                    Choose from our upcoming support group sessions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {groupSessions.map((session, index) => (
                    <Card key={index} className="p-4">
                      <h3 className="font-semibold mb-2">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.time}</p>
                      <p className="text-sm text-gray-600">Facilitator: {session.facilitator}</p>
                      <p className="text-sm text-gray-600 mb-3">{session.spots}</p>
                      <Button 
                        onClick={() => handleBooking(session.title)}
                        className="w-full"
                      >
                        Book Session
                      </Button>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <img
                      src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                      alt="Workshop session"
                      className="w-full h-64 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="text-tribe-grey">Wellness Workshops</CardTitle>
                      <CardDescription className="text-tribe-grey">
                        Participate in interactive workshops focused on mental health education and skill-building.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upcoming Workshops</DialogTitle>
                  <DialogDescription>
                    Browse and book our upcoming wellness workshops
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {workshops.map((workshop, index) => (
                    <Card key={index} className="p-4">
                      <h3 className="font-semibold mb-2">{workshop.title}</h3>
                      <p className="text-sm text-gray-600">{workshop.date}</p>
                      <p className="text-sm text-gray-600">Instructor: {workshop.instructor}</p>
                      <p className="text-sm text-gray-600 mb-3">Duration: {workshop.duration}</p>
                      <Button 
                        onClick={() => handleBooking(workshop.title)}
                        className="w-full"
                      >
                        Book Workshop
                      </Button>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;