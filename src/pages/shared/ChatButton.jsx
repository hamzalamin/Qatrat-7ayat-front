import { MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ChatButton = () => {
  const { openChat } = useChat();

  return (
    <button 
      className="p-2 hover:bg-neutral-100 rounded-lg" 
      title="مراسلة"
      onClick={openChat}
    >
      <MessageCircle className="w-5 h-5 text-neutral-600" />
    </button>
  );
};

export default ChatButton;