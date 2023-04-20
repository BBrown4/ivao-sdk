import { ILastTrack } from './ILastTrack';
import { IFlightPlan } from './IFlightPlan';
import { IPilotSession } from './IPilotSession';
export interface IGetPilotsFilteredOptions {
    limit?: number;
    time?: number;
    id?: number;
    userId?: number;
    callsign?: string;
    serverId?: string;
    softwareTypeId?: string;
    softwareVersion?: string;
    rating?: number;
    createdAt?: string;
    lastTrack?: Partial<ILastTrack>;
    flightPlan?: Partial<IFlightPlan>;
    pilotSession?: Partial<IPilotSession>;
}
