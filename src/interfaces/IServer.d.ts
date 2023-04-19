export interface IServer {
    id: string;
    hostname: string;
    ip: string;
    description: string;
    countryId: string;
    currentConnections: number;
    maximumConnections: number;
}
