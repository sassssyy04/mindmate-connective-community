import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import "./App.css";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;