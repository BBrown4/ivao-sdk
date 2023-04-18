import { ILastTrack } from './ILastTrack';
import { IAtcSession } from './IAtcSession';
import { IAtis } from './IAtis';

export interface IGetAtcsFilteredOptions {
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
  atcSession?: Partial<IAtcSession>;
  atis?: Omit<Partial<IAtis>, 'lines'>;
}
