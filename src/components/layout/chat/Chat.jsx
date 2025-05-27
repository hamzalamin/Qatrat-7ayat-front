import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { 
  connectWebSocket, 
  disconnectWebSocket, 
  sendMessage, 
  subscribeToMessages, 
  subscribeToDisconnect,
  getConnectionStatus 
} from '../../../services/chatServices';
import userService from '../../../services/userService';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Refs for avoiding stale closures
  const currentReceiverIdRef = useRef(receiverId);
  const messagesRef = useRef(messages);
  
  // Memoized user data from localStorage
  const userData = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return {
        token: user?.token,
        email: user?.email,
        id: user?.id
      };
    } catch {
      return { token: null, email: null, id: null };
    }
  }, []);

  const { token, email: userEmail, id: currentUserId } = userData;

  // Update refs when state changes
  useEffect(() => {
    currentReceiverIdRef.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Memoized message handler to prevent recreations
  const handleIncomingMessage = useCallback((incomingMsg) => {
    console.log("Incoming WebSocket message:", incomingMsg);
    
    // Handle both WebSocket message format and API response format
    const normalizedMsg = {
      id: incomingMsg.id || `ws-${Date.now()}-${Math.random()}`,
      content: incomingMsg.content,
      senderId: incomingMsg.senderId || incomingMsg.sender?.id,
      receiverId: incomingMsg.receiverId || incomingMsg.receiver?.id,
      timestamp: incomingMsg.timestamp || incomingMsg.createdAt || new Date().toISOString(),
      sender: incomingMsg.sender || (incomingMsg.senderId ? 
        users.find(u => u.id === incomingMsg.senderId) : null
      ),
      receiver: incomingMsg.receiver || (incomingMsg.receiverId ? 
        users.find(u => u.id === incomingMsg.receiverId) : null
      )
    };

    // Always add relevant messages, regardless of current chat selection
    // This ensures messages are received in real-time even if user switches chats
    const isRelevantToUser = (
      normalizedMsg.senderId === currentUserId || 
      normalizedMsg.receiverId === currentUserId
    );

    if (isRelevantToUser) {
      // Check if this message is for the currently active chat
      const currentReceiver = currentReceiverIdRef.current;
      const isForCurrentChat = currentReceiver && (
        (normalizedMsg.senderId == currentUserId && normalizedMsg.receiverId == currentReceiver) ||
        (normalizedMsg.senderId == currentReceiver && normalizedMsg.receiverId == currentUserId)
      );

      if (isForCurrentChat) {
        setMessages(prevMessages => {
          // Check for duplicates
          const isDuplicate = prevMessages.some(existingMsg => 
            existingMsg.id === normalizedMsg.id ||
            (existingMsg.content === normalizedMsg.content &&
             existingMsg.senderId === normalizedMsg.senderId &&
             existingMsg.receiverId === normalizedMsg.receiverId &&
             Math.abs(new Date(existingMsg.timestamp) - new Date(normalizedMsg.timestamp)) < 2000)
          );
          
          if (isDuplicate) {
            return prevMessages;
          }
          
          // Add new message and sort by timestamp
          const newMessages = [...prevMessages, normalizedMsg];
          return newMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
      }

      // You could also store messages for other chats in a global state or context
      // For now, we'll just log them
      console.log('Message received for user:', normalizedMsg);
    }
  }, [currentUserId, users]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!token) return;

    let messageUnsubscribe, disconnectUnsubscribe;

    const initializeConnection = async () => {
      try {
        await connectWebSocket(
          token,
          () => {
            setIsConnected(true);
            console.log('Chat WebSocket connected');
          },
          (error) => {
            console.error('WebSocket connection error:', error);
            setError('Connection failed. Please refresh the page.');
            setIsConnected(false);
          }
        );

        // Subscribe to message events
        messageUnsubscribe = subscribeToMessages(handleIncomingMessage);
        
        // Subscribe to disconnect events
        disconnectUnsubscribe = subscribeToDisconnect(() => {
          setIsConnected(false);
        });

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setError('Failed to connect to chat service.');
        setIsConnected(false);
      }
    };

    initializeConnection();

    return () => {
      messageUnsubscribe?.();
      disconnectUnsubscribe?.();
      disconnectWebSocket();
    };
  }, [token, handleIncomingMessage]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch messages when receiver changes
  useEffect(() => {
    if (receiverId && token) {
      fetchMessages(receiverId);
    } else {
      setMessages([]);
    }
  }, [receiverId, token]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll();
      const fetchedUsers = response.data || [];
      // Filter out current user from the list
      const otherUsers = fetchedUsers.filter(user => user.id !== currentUserId);
      setUsers(otherUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (receiverId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/v1/messages/${receiverId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform API response to match expected format
        const transformedMessages = (data || []).map((msg, index) => ({
          id: msg.id || `msg-${index}-${Date.now()}`,
          content: msg.content,
          senderId: msg.senderId || (msg.receiver?.id === currentUserId ? parseInt(receiverId) : currentUserId),
          receiverId: msg.receiverId || (msg.receiver?.id === currentUserId ? currentUserId : parseInt(receiverId)),
          timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
          sender: msg.sender || (msg.receiver?.id === currentUserId ? 
            users.find(u => u.id === parseInt(receiverId)) : 
            { id: currentUserId, email: userEmail }
          ),
          receiver: msg.receiver || users.find(u => u.id === parseInt(receiverId))
        }));
        
        // Sort by timestamp if available, otherwise by array order
        const sortedMessages = transformedMessages.sort((a, b) => {
          const timeA = new Date(a.timestamp);
          const timeB = new Date(b.timestamp);
          return timeA - timeB;
        });
        
        setMessages(sortedMessages);
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = useCallback(() => {
    if (!receiverId) {
      alert("Please select a user to send message to");
      return;
    }
    
    if (!message.trim()) {
      return;
    }

    if (!isConnected) {
      alert("Not connected to chat service. Please wait or refresh the page.");
      return;
    }

    const messageData = {
      receiverId: parseInt(receiverId),
      content: message.trim(),
      senderId: currentUserId
    };

    const success = sendMessage(messageData);
    if (success) {
      setMessage('');
      
      // Optimistically add message to UI
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: messageData.content,
        senderId: currentUserId,
        receiverId: parseInt(receiverId),
        timestamp: new Date().toISOString(),
        sender: { email: userEmail, id: currentUserId }
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
    } else {
      alert("Failed to send message. Please try again.");
    }
  }, [receiverId, message, isConnected, currentUserId, userEmail]);

  // Optimized message type detection
  const isMyMessage = useCallback((msg) => {
    // For API response format: if receiver.id equals currentUserId, then someone else sent it to me
    if (msg.receiver?.id === currentUserId) {
      return false; // Someone else sent this to me
    }
    
    // For WebSocket format or when senderId is available
    if (msg.senderId === currentUserId) {
      return true; // I sent this
    }
    
    // For API response format: if receiver.id is not currentUserId, then I sent it
    if (msg.receiver?.id && msg.receiver.id !== currentUserId) {
      return true; // I sent this to someone else
    }
    
    return false; // Default to not my message
  }, [currentUserId]);

  // Optimized sender name getter
  const getMessageSenderName = useCallback((msg) => {
    if (isMyMessage(msg)) {
      return 'You';
    }
    
    // Try sender object first
    if (msg.sender?.firstName) {
      return msg.sender.firstName;
    }
    
    if (msg.sender?.email) {
      return msg.sender.email;
    }
    
    // For messages from API response format, check receiver object
    // If receiver.id matches currentUserId, then the other person sent it
    if (msg.receiver?.id === currentUserId) {
      // Find the sender in users list using receiverId (which would be the other person)
      const sender = users.find(u => u.id === parseInt(receiverId));
      return sender?.firstName || sender?.email || 'Unknown User';
    }
    
    // Fallback to finding user in users list by senderId
    const sender = users.find(u => u.id === msg.senderId);
    return sender?.firstName || sender?.email || 'Unknown User';
  }, [isMyMessage, users, receiverId, currentUserId]);

  // Memoized selected user info
  const selectedUser = useMemo(() => {
    return users.find(user => user.id === parseInt(receiverId));
  }, [users, receiverId]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {selectedUser ? `Chat with ${selectedUser.firstName || selectedUser.email}` : 'Chat'}
        </h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* User Selection */}
      <div className="mb-4">
        <select
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setReceiverId(e.target.value)}
          value={receiverId}
          disabled={loading}
        >
          <option value="" disabled>
            {loading ? 'Loading users...' : 'Select a user to chat with'}
          </option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName || user.email} 
              {user.role?.name && ` (${user.role.name.replace('ROLE_', '')})`}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Display */}
      <div className="border border-gray-300 rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={msg.id || index} className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                isMyMessage(msg) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                {!isMyMessage(msg) && (
                  <div className="text-xs text-gray-500 mb-1 font-medium">
                    {getMessageSenderName(msg)}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">
                  {msg.content}
                </div>
                {msg.timestamp && (
                  <div className={`text-xs mt-2 ${isMyMessage(msg) ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-16">
            {receiverId ? 'No messages yet. Start the conversation!' : 'Select a user to start chatting'}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <textarea
          placeholder="Type a message... (Press Enter to send)"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 p-3 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="2"
          disabled={!receiverId || !isConnected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!receiverId || !message.trim() || !isConnected}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
      
      {!isConnected && (
        <p className="text-sm text-red-600 mt-2 text-center">
          Connection lost. Messages cannot be sent until reconnected.
        </p>
      )}
    </div>
  );
};

export default ChatPage;