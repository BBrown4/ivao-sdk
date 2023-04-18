import { IPilot } from './IPilot';
import { IAtc } from './IAtc';
import { IFollowMe } from './IFollowMe';
import { IObserver } from './IObserver';

export interface IClients {
  pilots: IPilot[];
  atcs: IAtc[];
  followMe: IFollowMe[];
  observers: IObserver[];
}
