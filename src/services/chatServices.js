import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let isConnected = false;

export function connectWebSocket(onMessageReceived, token, onConnected) {
  if (isConnected) {
    console.warn('⚠️ WebSocket is already connected.');
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: (str) => console.log('[STOMP DEBUG]', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      isConnected = true;
      console.log('✅ STOMP connected');

      stompClient.subscribe('/user/queue/messages', (message) => {
        const body = JSON.parse(message.body);
        onMessageReceived(body);
      });

      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      console.error('❌ STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
    },
    onWebSocketError: (evt) => {
      console.error('❌ WebSocket error:', evt);
    },
    onWebSocketClose: (evt) => {
      console.warn('⚠️ WebSocket closed:', evt);
      isConnected = false;
    }
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
  }
}

export function sendMessage(msg) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(msg)
    });
  } else {
    console.warn('❌ STOMP client not connected, cannot send message');
  }
}
