import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ResourcesSection = () => {
  const { toast } = useToast();

  const handleBooking = (eventType: string) => {
    toast({
      title: "Coming Soon",
      description: `Booking for ${eventType} will be available soon!`,
    });
  };

  const resources = [
    {
      title: "Guided Meditations",
      description: "Access our library of calming meditation sessions",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      sessions: [
        {
          title: "Morning Mindfulness",
          instructor: "Sarah Chen",
          duration: "15 minutes",
          type: "Beginner",
        },
        {
          title: "Stress Relief",
          instructor: "Michael Brown",
          duration: "20 minutes",
          type: "Intermediate",
        },
        {
          title: "Deep Relaxation",
          instructor: "Emma Wilson",
          duration: "30 minutes",
          type: "Advanced",
        },
      ],
    },
    {
      title: "Wellness Workshops",
      description: "Join interactive sessions with mental health experts",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      sessions: [
        {
          title: "Anxiety Management",
          instructor: "Dr. James Wilson",
          duration: "90 minutes",
          date: "Next Tuesday at 2:00 PM",
        },
        {
          title: "Sleep Hygiene",
          instructor: "Dr. Lisa Thompson",
          duration: "60 minutes",
          date: "Next Thursday at 7:00 PM",
        },
        {
          title: "Stress Resilience",
          instructor: "Dr. Robert Chen",
          duration: "90 minutes",
          date: "Next Saturday at 10:00 AM",
        },
      ],
    },
    {
      title: "Self-Help Guides",
      description: "Explore comprehensive mental wellness resources",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      guides: [
        {
          title: "Understanding Anxiety",
          author: "Dr. Sarah Johnson",
          length: "45 minutes read",
          level: "Beginner",
        },
        {
          title: "Building Better Sleep Habits",
          author: "Dr. Michael Chen",
          length: "30 minutes read",
          level: "Intermediate",
        },
        {
          title: "Mindfulness for Daily Life",
          author: "Lisa Thompson",
          length: "60 minutes read",
          level: "Advanced",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-tribe-grey">Mental Health Resources</h2>
        <p className="mt-4 text-xl text-tribe-grey">
          Discover tools and guidance for your wellness journey
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, index) => (
          <Dialog key={resource.title}>
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-tribe-grey">{resource.title}</CardTitle>
                    <CardDescription className="text-tribe-grey">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{resource.title}</DialogTitle>
                <DialogDescription>
                  Choose from our available {resource.title.toLowerCase()}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {resource.sessions ? (
                  // Render sessions for Guided Meditations and Wellness Workshops
                  resource.sessions.map((session, idx) => (
                    <Card key={idx} className="p-4">
                      <h3 className="font-semibold mb-2">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        Instructor: {session.instructor}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {session.duration}
                      </p>
                      {session.type && (
                        <p className="text-sm text-gray-600">Level: {session.type}</p>
                      )}
                      {session.date && (
                        <p className="text-sm text-gray-600">Date: {session.date}</p>
                      )}
                      <Button
                        onClick={() => handleBooking(session.title)}
                        className="w-full mt-3"
                      >
                        Book Session
                      </Button>
                    </Card>
                  ))
                ) : resource.guides ? (
                  // Render guides for Self-Help Guides
                  resource.guides.map((guide, idx) => (
                    <Card key={idx} className="p-4">
                      <h3 className="font-semibold mb-2">{guide.title}</h3>
                      <p className="text-sm text-gray-600">Author: {guide.author}</p>
                      <p className="text-sm text-gray-600">Length: {guide.length}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        Level: {guide.level}
                      </p>
                      <Button
                        onClick={() => handleBooking(guide.title)}
                        className="w-full"
                      >
                        Access Guide
                      </Button>
                    </Card>
                  ))
                ) : null}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};