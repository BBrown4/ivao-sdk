import { IIvaoData } from '../interfaces/IIvaoData';
import { TypedEmitter } from 'tiny-typed-emitter';
import { IIvaoClientOptions } from '../interfaces/IIvaoClientOptions';
import { IIvaoClientEvents } from '../interfaces/IIvaoClientEvents';
import { IServer } from '../interfaces/IServer';
import { IGetServersFilteredOptions } from '../interfaces/IGetServersFilteredOptions';
import { IConnections } from '../interfaces/IConnections';
import { IGetConnectionsMetadataOptions } from '../interfaces/IGetConnectionsMetadataOptions';
import { IClients } from '../interfaces/IClients';
import { IGetClientsFilteredOptions } from '../interfaces/IGetClientsFilteredOptions';
import { IPilot } from '../interfaces/IPilot';
import { IGetPilotsFilteredOptions } from '../interfaces/IGetPilotsFilteredOptions';
import { IAtc } from '../interfaces/IAtc';
import { IGetAtcsFilteredOptions } from '../interfaces/IGetAtcsFilteredOptions';
import { IObserver } from '../interfaces/IObserver';
import { IGetObserversFilteredOptions } from '../interfaces/IGetObserversFilteredOptions';
/**
 * @description The main client class for interacting with the IVAO API
 */
export declare class IvaoClient extends TypedEmitter<IIvaoClientEvents> {
    private readonly API_URL;
    private ivaoData;
    private readonly dataRefreshRate;
    private logger;
    private isRunning;
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
    constructor(options?: IIvaoClientOptions);
    private refreshIvaoData;
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
    getIvaoDataRaw(): IIvaoData | null | undefined;
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
    getIvaoConnectionsMetadata(options?: IGetConnectionsMetadataOptions): Partial<IConnections> | undefined;
    /**
     * @description Get all world servers.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoServersAll();
     * ```
     */
    getIvaoServersAll(): IServer[] | undefined;
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
    getIvaoServersFiltered(options?: IGetServersFilteredOptions): IServer[] | undefined;
    /**
     * @description Get all voice servers.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoVoiceServersAll();
     * ```
     */
    getIvaoVoiceServersAll(): IServer[] | undefined;
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
    getIvaoVoiceServersFiltered(options?: IGetServersFilteredOptions): IServer[] | undefined;
    /**
     * @description Get all clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const clients = client.getIvaoClientsAll();
     * ```
     */
    getIvaoClientsAll(): IClients | undefined;
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
    getIvaoClientsFiltered(options?: IGetClientsFilteredOptions): Partial<IClients> | undefined;
    /**
     * @description Get all pilot clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const pilots = client.getIvaoPilotsAll();
     * ```
     */
    getIvaoPilotsAll(): IPilot[] | undefined;
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
    getIvaoPilotsFiltered(options?: IGetPilotsFilteredOptions): IPilot[] | undefined;
    /**
     * @description Get all ATC clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const atcs = client.getIvaoAtcsAll();
     * ```
     */
    getIvaoAtcsAll(): IAtc[] | undefined;
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
    getIvaoAtcsFiltered(options?: IGetAtcsFilteredOptions): IAtc[] | undefined;
    /**
     * @description Get all observer clients connected to the network.
     * @example
     * ```javascript
     * const observers = client.getIvaoObserversAll();
     * ```
     */
    getIvaoObserversAll(): IObserver[] | undefined;
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
    getIvaoObserversFiltered(options?: IGetObserversFilteredOptions): IObserver[] | undefined;
    /**
     * @description Kills the current client instance and clears the data.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * client.kill();
     * ```
     */
    kill(): void;
    /**
     * @description Restarts the client instance.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * client.restart();
     * ```
     */
    restart(): void;
    private initLogger;
}
