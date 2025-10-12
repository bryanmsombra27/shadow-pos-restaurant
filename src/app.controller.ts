import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BarGateway } from './bar/bar.gateway';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly barGateway: BarGateway,
  ) {}

  @Get()
  getHello(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: any,
  ): string {
    console.log('ENTRA', payload);
    this.barGateway.handleMessage(socket, payload);
    return this.appService.getHello();
  }
}
