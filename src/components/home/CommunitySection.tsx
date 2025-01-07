import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const CommunitySection = () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-tribe-grey">Join Our Community</h2>
        <p className="mt-4 text-xl text-tribe-grey">
          Connect with facilitators and peers in a supportive environment
        </p>
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
                  <Button onClick={() => handleBooking(session.title)} className="w-full">
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
                  <Button onClick={() => handleBooking(workshop.title)} className="w-full">
                    Book Workshop
                  </Button>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};