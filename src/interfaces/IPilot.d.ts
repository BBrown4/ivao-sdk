import { IFlightPlan } from './IFlightPlan';
import { ILastTrack } from './ILastTrack';
import { IPilotSession } from './IPilotSession';
export interface IPilot {
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
    flightPlan: IFlightPlan;
    pilotSession: IPilotSession;
}
