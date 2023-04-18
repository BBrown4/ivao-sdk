export interface IGetServersFilteredOptions {
  id?: string;
  hostname?: string;
  ip?: string;
  description?: string;
  countryId?: string;
  currentConnections?: number;
  maxConnections?: number;
  limit?: number;
}
