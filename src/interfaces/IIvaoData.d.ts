import { IConnections } from './IConnections';
import { IServer } from './IServer';
import { IClients } from './IClients';
export interface IIvaoData {
    updatedAt: string;
    servers: IServer[];
    voiceServers: IServer[];
    clients: IClients;
    connections: IConnections;
}
