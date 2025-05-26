import React, { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket, sendMessage } from '../../../services/chatServices';
import userService from '../../../services/userService';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    useEffect(() => {
        fetchUsers();
        if (token) {
            connectWebSocket(handleIncomingMessage, token, () => setIsConnected(true));
        }
        return () => disconnectWebSocket();
    }, [token]);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAll();
            setUsers(response.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const handleIncomingMessage = (msg) => {
        setMessages(prev => [...prev, msg]);
    };

    const handleSendMessage = () => {

        sendMessage({
            receiverId,
            content: message.trim()
        });

        setMessage('');
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Chat</h2>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <select
                className="border p-2 mb-4 w-full"
                onChange={e => setReceiverId(e.target.value)}
                value={receiverId}
            >
                <option value="" disabled>Select a user to chat</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.firstName || user.email} ({user.role?.name?.replace('ROLE_', '')})
                    </option>
                ))}
            </select>

            <div className="border p-2 h-64 overflow-y-auto mb-4 bg-gray-50">
                {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
                {messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                        <strong>{msg.sender?.firstName || msg.sender?.email || 'You'}:</strong>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="border p-2 flex-grow"
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
