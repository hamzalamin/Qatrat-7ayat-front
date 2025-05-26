import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socketUrl = 'http://localhost:8081/ws';

export const connectWebSocket = (userId, onMessageCallback, token) => {
  const stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
        const body = JSON.parse(message.body);
        onMessageCallback(body);
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame);
    },
  });

  stompClient.activate();

  return stompClient;
};
