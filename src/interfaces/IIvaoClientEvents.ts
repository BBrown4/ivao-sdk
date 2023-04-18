import { IIvaoData } from './IIvaoData';

export interface IIvaoClientEvents {
  connected: () => void;
  dataRefreshed: (data: IIvaoData) => void;
}
