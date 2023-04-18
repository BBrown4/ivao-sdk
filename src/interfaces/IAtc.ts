import { IAtcSession } from './IAtcSession';
import { IAtis } from './IAtis';
import { ILastTrack } from './ILastTrack';

export interface IAtc {
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
  atis: IAtis;
}
