import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  type Orden,
  type Mesa,
  PedidoPorOrden,
  type Notificaciones,
} from 'generated/prisma';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class BarGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('test')
  handleMessage(client: Socket, payload: any) {
    console.log(payload, 'SOCKET CLIENT');

    client.emit('test', 'respuesta del backend');
  }

  @SubscribeMessage('mesa')
  handleTableTaken(client: Socket, payload: Mesa) {
    console.log(payload, 'SOCKET CLIENT MESA');
    this.server.emit('mesa', payload);
  }

  @SubscribeMessage('notificaciones')
  handleOrderReady(client: Socket, payload: Notificaciones) {
    client.emit('notificaciones', payload);
  }
}
