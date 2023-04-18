import { IAtcSession } from './IAtcSession';
import { ILastTrack } from './ILastTrack';

export interface IObserver {
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
  atcSession: IAtcSession;
}
