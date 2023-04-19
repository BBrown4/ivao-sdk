import { ILastTrack } from './ILastTrack';
import { IAtcSession } from './IAtcSession';
export interface IGetObserversFilteredOptions {
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
    lastTrack?: Omit<Partial<ILastTrack>, 'arrivalDistance' | 'departureDistance'>;
    atcSession?: Omit<Partial<IAtcSession>, 'position'>;
}
