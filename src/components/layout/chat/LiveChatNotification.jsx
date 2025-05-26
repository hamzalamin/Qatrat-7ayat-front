import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";

const demoMessages = [
  "Hi! Need help with something?",
  "Our support team is here for you.",
  "Got a question? Ask us anything!"
];

const LiveChatNotification = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // default minimized
  const [message, setMessage] = useState(null); // optional for future use
  const [isVisible, setIsVisible] = useState(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      setMessage({
        text: randomMessage,
        sender: "Support Team",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setIsVisible(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Link
      to="/messaging"
      className="fixed bottom-6 left-6 z-50 font-cairo"
      onClick={() => setIsMinimized(false)}
    >
      <div
        className={`bg-primary-500 text-white rounded-full p-4 shadow-xl cursor-pointer transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
      >
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          <span className="font-bold">Chat</span>
        </div>
      </div>
    </Link>
  );
};

export default LiveChatNotification;
