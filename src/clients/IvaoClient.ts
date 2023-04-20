import axios from 'axios';
import { IIvaoData } from '../interfaces/IIvaoData';
import winston from 'winston';
import { TypedEmitter } from 'tiny-typed-emitter';
import { IIvaoClientOptions } from '../interfaces/IIvaoClientOptions';
import { IIvaoClientEvents } from '../interfaces/IIvaoClientEvents';
import { IServer } from '../interfaces/IServer';
import { IGetServersFilteredOptions } from '../interfaces/IGetServersFilteredOptions';
import { IConnections } from '../interfaces/IConnections';
import { IGetConnectionsMetadataOptions } from '../interfaces/IGetConnectionsMetadataOptions';
import { IClients } from '../interfaces/IClients';
import { IGetClientsFilteredOptions } from '../interfaces/IGetClientsFilteredOptions';
import { GetClientsFilteredOptionsKeys } from '../interfaces/IGetClientsFilteredOptionsQuery';
import { IPilot } from '../interfaces/IPilot';
import { IGetPilotsFilteredOptions } from '../interfaces/IGetPilotsFilteredOptions';
import { ILastTrack } from '../interfaces/ILastTrack';
import { IFlightPlan } from '../interfaces/IFlightPlan';
import { IAircraft } from '../interfaces/IAircraft';
import { IPilotSession } from '../interfaces/IPilotSession';
import { IAtc } from '../interfaces/IAtc';
import { IGetAtcsFilteredOptions } from '../interfaces/IGetAtcsFilteredOptions';
import { IAtcSession } from '../interfaces/IAtcSession';
import { IAtis } from '../interfaces/IAtis';
import { IObserver } from '../interfaces/IObserver';
import { IGetObserversFilteredOptions } from '../interfaces/IGetObserversFilteredOptions';

/**
 * @description The main client class for interacting with the IVAO API
 */
export class IvaoClient extends TypedEmitter<IIvaoClientEvents> {
    private readonly API_URL: string = 'https://api.ivao.aero/v2/tracker/whazzup';
    private ivaoData: IIvaoData | null | undefined;
    private readonly dataRefreshRate: number;
    private logger: winston.Logger;
    private isRunning: boolean = false;

    /**
     * @description When constructing the client, you can optionally pass in an options object to set the data refresh rate.
     * The mininum refresh rate is 15 seconds to avoid an IP ban from the IVAO API, and as such the default is also 15 seconds.
     * @param options
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * // OR
     * const client = new IvaoClient({ dataRefreshRate: 30 });
     * ```
     */
    constructor(options: IIvaoClientOptions = { dataRefreshRate: 15 }) {
        super();

        this.isRunning = true;
        this.logger = this.initLogger();

        // get initial data
        this.refreshIvaoData()
            .then((data) => {
                this.ivaoData = data;
            })
            .catch((error) => {
                this.logger.log({
                    level: 'error',
                    message: error.message,
                });
            })
            .finally(() => {
                this.emit('connected');
            });

        this.dataRefreshRate = options.dataRefreshRate * 1000;

        if (this.dataRefreshRate < 15000) {
            this.logger.log({
                level: 'warn',
                message: 'IvaoClient: data refresh rate is too low, setting to 15 seconds',
            });

            this.dataRefreshRate = 15000;
        }

        setInterval(async () => {
            try {
                this.ivaoData = await this.refreshIvaoData();
            } catch (error: any) {
                this.logger.log({
                    level: 'error',
                    message: error.message,
                });
            }
        }, this.dataRefreshRate);
    }

    private async refreshIvaoData(): Promise<IIvaoData> {
        return new Promise((resolve, reject) => {
            axios
                .get(this.API_URL)
                .then((response) => {
                    resolve(response.data);

                    this.emit('dataRefreshed', response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * @description Gets the entire unprocessed JSON data from the API. This can potentially be a large amount of data depending on network load
     * at the time of request. Only use this if you would like to parse the data yourself, otherwise use the other methods
     * included in the SDK.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const data = client.getIvaoDataRaw();
     * ```
     */
    public getIvaoDataRaw(): IIvaoData | null | undefined {
        return this.ivaoData;
    }

    /**
     * @description Get connection metadata from the API. This includes the number of clients connected to each server, atc controllers, pilots, etc.
     * An optional options object can be passed in to only return specific keys from the metadata object.
     * @param options
     * @example
     * Get all metadata
     * ```javascript
     * const client = new IvaoClient();
     * const metadata = client.getIvaoConnectionsMetadata();
     * console.log(metadata);
     *
     * // output: { total: 876, supervisor: 4, atc: 103, observer: 19, pilots: 754, worldTour: 132, followMe: 0 }
     *```
     * @example
     * Get specific keys from metadata
     * ```javascript
     * const client = new IvaoClient();
     * const metadata = client.getIvaoConnectionsMetadata({ keys: ['total', 'atc'] });
     * console.log(metadata);
     *
     * output: { total: 876, atc: 103 }
     * ```
     */
    public getIvaoConnectionsMetadata(
        options?: IGetConnectionsMetadataOptions
    ): Partial<IConnections> | undefined {
        if (!this.ivaoData) return undefined;

        if (options?.keys) {
            const keys = options.keys;
            const connections: Partial<IConnections> = {};
            for (let key in this.ivaoData.connections) {
                if (keys.includes(key as keyof IConnections)) {
                    connections[key as keyof IConnections] =
                        this.ivaoData.connections[key as keyof IConnections];
                }
            }

            return connections;
        }
        return this.ivaoData.connections;
    }

    /**
     * @description Get all world servers.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoServersAll();
     * ```
     */
    public getIvaoServersAll(): IServer[] | undefined {
        return this.ivaoData?.servers;
    }

    /**
     * @description Get filtered world servers. An optional options object can be passed in to filter the servers by any of the keys in the IServer interface.
     * At the time of writing this, only a single world/voice server exists.
     * @param options
     * @example
     * ```javascript
     * const client = new IvaoClient();
     *  const servers = client.getIvaoServersFiltered({
     *    limit: 10,
     *    countryId: 'US'
     *  });
     *  ```
     */
    public getIvaoServersFiltered(options?: IGetServersFilteredOptions): IServer[] | undefined {
        if (!this.ivaoData?.servers) {
            return undefined;
        }

        let servers = this.ivaoData.servers;
        const filter: IGetServersFilteredOptions = options || {};
        if (!filter) return servers;

        servers = servers.filter((server) => {
            for (let key in filter) {
                if (
                    server[key as keyof IServer] === undefined ||
                    server[key as keyof IServer] !== filter[key as keyof IGetServersFilteredOptions]
                ) {
                    return false;
                }
            }

            return true;
        });

        return servers;
    }

    /**
     * @description Get all voice servers.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoVoiceServersAll();
     * ```
     */
    public getIvaoVoiceServersAll(): IServer[] | undefined {
        return this.ivaoData?.voiceServers;
    }

    /**
     * @description Get filtered voice servers. An optional options object can be passed in to filter the servers by any of the keys in the IServer interface.
     * At the time of writing this, only a single world/voice server exists.
     * @param options
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoVoiceServersFiltered({
     *  limit: 10,
     *  countryId: 'US'
     * });
     * ```
     */
    public getIvaoVoiceServersFiltered(
        options?: IGetServersFilteredOptions
    ): IServer[] | undefined {
        if (!this.ivaoData?.voiceServers) {
            return undefined;
        }

        let servers = this.ivaoData.voiceServers;
        const filter: IGetServersFilteredOptions = options || {};
        if (!filter) return servers;

        servers = servers.filter((server) => {
            for (let key in filter) {
                if (
                    server[key as keyof IServer] === undefined ||
                    server[key as keyof IServer] !== filter[key as keyof IGetServersFilteredOptions]
                ) {
                    return false;
                }
            }

            return true;
        });

        return servers;
    }

    /**
     * @description Get all clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const clients = client.getIvaoClientsAll();
     * ```
     */
    public getIvaoClientsAll(): IClients | undefined {
        return this.ivaoData?.clients;
    }

    /**
     * @description Get clients connected to the network with filtering applied. This can be used to get a specific subset of clients
     * as well as apply limits to the number of clients returned for each subset. An optional options object can be passed
     * with a single key of `query` which is an array of objects with the following properties: `keys` and `limit`.
     *
     * If no options object is passed, it will behave the same as {@link IvaoClient.getIvaoClientsAll}
     * @param options
     * @example With options object and queries
     * ```javascript
     * const client = new IvaoClient();
     * const clients = ivaoClient.getIvaoClientsFiltered({
     *       query: [
     *         {
     *           keys: ['pilots'],
     *           limit: 3,
     *         },
     *         {
     *           keys: ['observers', 'atcs'],
     *         },
     *       ],
     *     });
     *
     * console.log(clients);
     * // output: {
     * //  pilots: [
     * //    { ... },
     * //    { ... },
     * //    { ... },
     * //  ],
     * //  observers: [
     * //    { ... }, total observers
     * //  ],
     * //  atcs: [
     * //    { ... }, total atcs
     * //  ]
     * // }
     */
    public getIvaoClientsFiltered(
        options?: IGetClientsFilteredOptions
    ): Partial<IClients> | undefined {
        if (!this.ivaoData?.clients) return undefined;

        if (options?.query) {
            const clients: Partial<IClients> = {};

            options.query.forEach((query) => {
                if (query.keys) {
                    const keys = query.keys;

                    for (let key in this.ivaoData?.clients) {
                        if (keys.includes(key as GetClientsFilteredOptionsKeys)) {
                            // @ts-ignore
                            clients[key as keyof IClients] =
                                this.ivaoData.clients[key as keyof IClients];

                            if (query.limit) {
                                // @ts-ignore
                                clients[key as keyof IClients] = clients[
                                    key as keyof IClients
                                ]?.slice(0, query.limit);
                            }
                        }
                    }
                }
            });
            return clients;
        }

        return this.ivaoData.clients;
    }

    /**
     * @description Get all pilot clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const pilots = client.getIvaoPilotsAll();
     * ```
     */
    public getIvaoPilotsAll(): IPilot[] | undefined {
        return this.ivaoData?.clients?.pilots;
    }

    /**
     * @description Get filtered pilot clients. An optional options object can be passed in to filter the pilots by any of the keys in the IPilot interface.
     * If no options object is passed, it will behave the same as {@link IvaoClient.getIvaoPilotsAll}
     * @param options
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const pilots = client.getIvaoPilotsFiltered({
     *  limit: 10,
     *  lastTrack: {
     *   onGround: false,
     *  }
     * });
     * ```
     */
    public getIvaoPilotsFiltered(options?: IGetPilotsFilteredOptions): IPilot[] | undefined {
        if (!this.ivaoData?.clients?.pilots) return undefined;
        const filter: IGetPilotsFilteredOptions = options || {};
        let filteredPilots = this.ivaoData.clients.pilots;

        if (filter.lastTrack) {
            filteredPilots = filteredPilots.filter((pilot) => {
                const lastTrack = pilot.lastTrack;

                if (!lastTrack) {
                    return false;
                }

                for (let prop in filter.lastTrack) {
                    if (
                        lastTrack[prop as keyof ILastTrack] !==
                        filter.lastTrack[prop as keyof ILastTrack]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        if (filter.flightPlan) {
            if (filter.flightPlan.aircraft) {
                filteredPilots = filteredPilots.filter((pilot) => {
                    const aircraft = pilot.flightPlan.aircraft;
                    if (!aircraft) return false;

                    for (let prop in filter.flightPlan!.aircraft) {
                        if (
                            aircraft[prop as keyof IAircraft] !==
                            filter.flightPlan!.aircraft[prop as keyof IAircraft]
                        ) {
                            return false;
                        }
                    }
                    return true;
                });
            }

            filteredPilots = filteredPilots.filter((pilot) => {
                const flightPlan = pilot.flightPlan;

                if (!flightPlan) return false;

                for (let prop in filter.flightPlan) {
                    if (typeof flightPlan[prop as keyof IFlightPlan] === 'object') continue;

                    if (
                        flightPlan[prop as keyof IFlightPlan] !==
                        filter.flightPlan[prop as keyof IFlightPlan]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        if (filter.pilotSession) {
            filteredPilots = filteredPilots.filter((pilot) => {
                const pilotSession = pilot.pilotSession;

                if (!pilotSession) return false;

                for (let prop in filter.pilotSession) {
                    if (
                        pilotSession[prop as keyof IPilotSession] !==
                        filter.pilotSession[prop as keyof IPilotSession]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        filteredPilots = filteredPilots.filter((pilot) => {
            for (let prop in filter) {
                if (prop === 'limit') continue;
                if (typeof pilot[prop as keyof IPilot] === 'object') continue;

                if (pilot[prop as keyof IPilot] !== filter[prop as keyof IPilot]) {
                    return false;
                }
            }

            return true;
        });

        if (filter.limit && filteredPilots.length > filter.limit) {
            filteredPilots = filteredPilots.slice(0, filter.limit);
        }

        return filteredPilots;
    }

    /**
     * @description Get all ATC clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const atcs = client.getIvaoAtcsAll();
     * ```
     */
    public getIvaoAtcsAll(): IAtc[] | undefined {
        return this.ivaoData?.clients?.atcs;
    }

    /**
     * @description Get filtered ATC clients. An optional options object can be passed in to filter the ATCs by any of the keys in the IAtc interface.
     * If no options object is passed, it will behave the same as {@link IvaoClient.getIvaoAtcsAll}
     * @param options
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const atcs = client.getIvaoAtcsFiltered({
     *  limit: 10,
     *  atcSession: {
     *   position: 'GND',
     *  }
     * });
     * ```
     */
    public getIvaoAtcsFiltered(options?: IGetAtcsFilteredOptions): IAtc[] | undefined {
        if (!this.ivaoData?.clients?.atcs) return undefined;
        const filter: IGetAtcsFilteredOptions = options || {};
        let filteredAtcs = this.ivaoData.clients.atcs;

        if (filter.lastTrack) {
            filteredAtcs = filteredAtcs.filter((atc) => {
                const lastTrack = atc.lastTrack;

                if (!lastTrack) {
                    return false;
                }

                for (let prop in filter.lastTrack) {
                    if (
                        lastTrack[prop as keyof ILastTrack] !==
                        filter.lastTrack[prop as keyof ILastTrack]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        if (filter.atcSession) {
            filteredAtcs = filteredAtcs.filter((atc) => {
                const atcSession = atc.atcSession;

                if (!atcSession) return false;

                for (let prop in filter.atcSession) {
                    if (
                        atcSession[prop as keyof IAtcSession] !==
                        filter.atcSession[prop as keyof IAtcSession]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        if (filter.atis) {
            filteredAtcs = filteredAtcs.filter((atc) => {
                const atis = atc.atis;

                if (!atis) return false;

                for (let prop in filter.atis) {
                    if (atis[prop as keyof IAtis] !== filter.atis[prop as keyof IAtis]) {
                        return false;
                    }
                }
                return true;
            });
        }

        filteredAtcs = filteredAtcs.filter((atc) => {
            for (let prop in filter) {
                if (prop === 'limit') continue;
                if (typeof atc[prop as keyof IAtc] === 'object') continue;

                if (atc[prop as keyof IAtc] !== filter[prop as keyof IAtc]) {
                    return false;
                }
            }

            return true;
        });

        if (filter.limit && filteredAtcs.length > filter.limit) {
            filteredAtcs = filteredAtcs.slice(0, filter.limit);
        }

        return filteredAtcs;
    }

    /**
     * @description Get all observer clients connected to the network.
     * @example
     * ```javascript
     * const observers = client.getIvaoObserversAll();
     * ```
     */
    public getIvaoObserversAll(): IObserver[] | undefined {
        return this.ivaoData?.clients?.observers;
    }

    /**
     * @description Get filtered observer clients. An optional options object can be passed in to filter the observers by any of the keys in the IObserver interface.
     * If no options object is passed, it will behave the same as {@link IvaoClient.getIvaoObserversAll}
     * @param options
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const observers = client.getIvaoObserversFiltered({
     *  rating: 3,
     *  lastTrack: {
     *    onGround: false,
     *  }
     * });
     * ```
     */
    public getIvaoObserversFiltered(
        options?: IGetObserversFilteredOptions
    ): IObserver[] | undefined {
        if (!this.ivaoData?.clients?.observers) return undefined;
        const filter: IGetObserversFilteredOptions = options || {};
        let filteredObservers = this.ivaoData.clients.observers;

        if (filter.lastTrack) {
            filteredObservers = filteredObservers.filter((observer) => {
                const lastTrack = observer.lastTrack;

                if (!lastTrack) return false;

                for (let prop in filter.lastTrack) {
                    if (
                        lastTrack[prop as keyof ILastTrack] !==
                        filter.lastTrack[prop as keyof ILastTrack]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        if (filter.atcSession) {
            filteredObservers = filteredObservers.filter((observer) => {
                const atcSession = observer.atcSession;

                if (!atcSession) return false;

                for (let prop in filter.atcSession) {
                    if (
                        atcSession[prop as keyof IAtcSession] !==
                        filter.atcSession[prop as keyof IAtcSession]
                    ) {
                        return false;
                    }
                }
                return true;
            });
        }

        filteredObservers = filteredObservers.filter((observer) => {
            for (let prop in filter) {
                if (prop === 'limit') continue;
                if (typeof observer[prop as keyof IObserver] === 'object') continue;

                if (observer[prop as keyof IObserver] !== filter[prop as keyof IObserver]) {
                    return false;
                }
            }

            return true;
        });

        if (filter.limit && filteredObservers.length > filter.limit) {
            filteredObservers = filteredObservers.slice(0, filter.limit);
        }

        return filteredObservers;
    }

    /**
     * @description Kills the current client instance and clears the data.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * client.kill();
     * ```
     */
    public kill(): void {
        this.logger.log({
            level: 'info',
            message: 'IvaoClient: killing client',
        });

        clearInterval(this.dataRefreshRate);
        this.ivaoData = null;
        this.logger.close();
        this.isRunning = false;
    }

    /**
     * @description Restarts the client instance.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * client.restart();
     * ```
     */
    public restart(): void {
        if (this.isRunning) {
            this.kill();
        }

        this.initLogger();
        this.logger.log({
            level: 'info',
            message: 'IvaoClient: restarting client',
        });

        // get initial data
        this.refreshIvaoData()
            .then((data) => {
                this.ivaoData = data;

                this.logger.log({
                    level: 'info',
                    message: 'IvaoClient: initial data fetched',
                });
            })
            .catch((error) => {
                this.logger.log({
                    level: 'error',
                    message: error.message,
                });
            });
    }

    private initLogger(): winston.Logger {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
        });

        // if we're not in production, log to console
        logger.add(
            new winston.transports.Console({
                format: winston.format.simple(),
            })
        );

        return logger;
    }
}
