import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
import { ApplyResponse } from './interfaces/applyRes';
import { Server } from 'socket.io'

@WebSocketGateway(
    {
        cors: {
            origin: '*',
        },
    }
)
export class VoucherGateway {
    @WebSocketServer()
    server: Server

    @SubscribeMessage('sendApplyRequest')
    identity(@MessageBody() data: ApplyResponse): ApplyResponse {
        return data
    }

}