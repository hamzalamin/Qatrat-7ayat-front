// chatServices.js - Optimized WebSocket service
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class ChatService {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.currentUserId = null;
  }

  connect(token, onConnected, onError) {
    if (this.isConnected) {
      console.log('WebSocket is already connected.');
      onConnected?.();
      return Promise.resolve();
    }

    // Extract user ID from token or get it from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      this.currentUserId = userData?.id;
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }

    return new Promise((resolve, reject) => {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => console.log('[STOMP DEBUG]', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        
        onConnect: () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log('STOMP connected successfully');
          
          // Subscribe to personal message queue - this receives messages sent TO this user
          this.stompClient.subscribe('/user/queue/messages', (message) => {
            try {
              const body = JSON.parse(message.body);
              console.log('Received personal message:', body);
              this.notifySubscribers('message', body);
            } catch (error) {
              console.error('Error parsing personal message:', error);
            }
          });

          // Subscribe to user-specific topic - this receives messages FROM this user to others
          if (this.currentUserId) {
            this.stompClient.subscribe(`/user/${this.currentUserId}/queue/messages`, (message) => {
              try {
                const body = JSON.parse(message.body);
                console.log('Received user-specific message:', body);
                this.notifySubscribers('message', body);
              } catch (error) {
                console.error('Error parsing user-specific message:', error);
              }
            });
          }

          // Subscribe to topic for all messages (if your backend supports this)
          this.stompClient.subscribe('/topic/messages', (message) => {
            try {
              const body = JSON.parse(message.body);
              console.log('Received topic message:', body);
              // Only process if this user is involved in the conversation
              if (body.senderId === this.currentUserId || body.receiverId === this.currentUserId) {
                this.notifySubscribers('message', body);
              }
            } catch (error) {
              console.error('Error parsing topic message:', error);
            }
          });

          onConnected?.();
          resolve();
        },
        
        onStompError: (frame) => {
          console.error('STOMP error:', frame.headers['message']);
          console.error('Details:', frame.body);
          onError?.(frame);
          reject(new Error('STOMP connection failed'));
        },
        
        onWebSocketError: (evt) => {
          console.error('WebSocket error:', evt);
          onError?.(evt);
        },
        
        onWebSocketClose: (evt) => {
          console.warn('WebSocket closed:', evt);
          this.isConnected = false;
          this.notifySubscribers('disconnect');
          
          // Auto-reconnect logic
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          }
        }
      });

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.isConnected = false;
      this.subscribers.clear();
      console.log('WebSocket disconnected');
    }
  }

  sendMessage(messageData) {
    if (!this.stompClient || !this.isConnected) {
      console.warn('STOMP client not connected');
      return false;
    }

    try {
      // Ensure the message format matches your backend expectations
      const formattedMessage = {
        receiverId: parseInt(messageData.receiverId),
        content: messageData.content.trim(),
        senderId: messageData.senderId
      };

      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(formattedMessage)
      });
      
      console.log('Message sent:', formattedMessage);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  // Subscribe to events (message, disconnect, etc.)
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    
    // Return unsubscribe function
    return () => {
      const eventSubscribers = this.subscribers.get(event);
      if (eventSubscribers) {
        eventSubscribers.delete(callback);
      }
    };
  }

  notifySubscribers(event, data) {
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const chatService = new ChatService();

// Export service methods
export const connectWebSocket = (token, onConnected, onError) => 
  chatService.connect(token, onConnected, onError);

export const disconnectWebSocket = () => 
  chatService.disconnect();

export const sendMessage = (messageData) => 
  chatService.sendMessage(messageData);

export const subscribeToMessages = (callback) => 
  chatService.subscribe('message', callback);

export const subscribeToDisconnect = (callback) => 
  chatService.subscribe('disconnect', callback);

export const getConnectionStatus = () => 
  chatService.getConnectionStatus();

export default chatService;