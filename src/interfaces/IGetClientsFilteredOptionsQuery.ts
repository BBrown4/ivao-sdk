export type GetClientsFilteredOptionsKeys = 'pilots' | 'atcs' | 'followMe' | 'observers';

export interface IGetClientsFilteredOptionsQuery {
  keys?: GetClientsFilteredOptionsKeys[];
  limit?: number;
}
