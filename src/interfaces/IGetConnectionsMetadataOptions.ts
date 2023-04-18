export type GetConnectionsMetadataOptionsKeys =
  | 'total'
  | 'supervisor'
  | 'atc'
  | 'observer'
  | 'pilot'
  | 'worldTour'
  | 'followMe';

export interface IGetConnectionsMetadataOptions {
  keys?: GetConnectionsMetadataOptionsKeys[];
}
