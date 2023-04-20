import { ILastTrack } from './ILastTrack';
import { IPilotSession } from './IPilotSession';
export interface IFollowMe {
    time: number;
    id: number;
    userId: number;
    callsign: string;
    serverId: string;
    softwareTypeId: string;
    softwareVersion: string;
    rating: number;
    createdAt: string;
    lastTrack: ILastTrack;
    pilotSession: IPilotSession;
}
