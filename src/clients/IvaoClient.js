"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvaoClient = void 0;
var axios_1 = __importDefault(require("axios"));
var winston = __importStar(require("winston"));
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
/**
 * @description The main client class for interacting with the IVAO API
 */
var IvaoClient = /** @class */ (function (_super) {
    __extends(IvaoClient, _super);
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
    function IvaoClient(options) {
        if (options === void 0) { options = { dataRefreshRate: 15 }; }
        var _this = _super.call(this) || this;
        _this.API_URL = 'https://api.ivao.aero/v2/tracker/whazzup';
        _this.isRunning = false;
        _this.isRunning = true;
        _this.logger = _this.initLogger();
        // get initial data
        _this.refreshIvaoData()
            .then(function (data) {
            _this.ivaoData = data;
        })
            .catch(function (error) {
            _this.logger.log({
                level: 'error',
                message: error.message,
            });
        })
            .finally(function () {
            _this.emit('connected');
        });
        _this.dataRefreshRate = options.dataRefreshRate * 1000;
        if (_this.dataRefreshRate < 15000) {
            _this.logger.log({
                level: 'warn',
                message: 'IvaoClient: data refresh rate is too low, setting to 15 seconds',
            });
            _this.dataRefreshRate = 15000;
        }
        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.refreshIvaoData()];
                    case 1:
                        _a.ivaoData = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        this.logger.log({
                            level: 'error',
                            message: error_1.message,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, _this.dataRefreshRate);
        return _this;
    }
    IvaoClient.prototype.refreshIvaoData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        axios_1.default
                            .get(_this.API_URL)
                            .then(function (response) {
                            resolve(response.data);
                            _this.emit('dataRefreshed', response.data);
                        })
                            .catch(function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
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
    IvaoClient.prototype.getIvaoDataRaw = function () {
        return this.ivaoData;
    };
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
    IvaoClient.prototype.getIvaoConnectionsMetadata = function (options) {
        if (!this.ivaoData)
            return undefined;
        if (options === null || options === void 0 ? void 0 : options.keys) {
            var keys = options.keys;
            var connections = {};
            for (var key in this.ivaoData.connections) {
                if (keys.includes(key)) {
                    connections[key] =
                        this.ivaoData.connections[key];
                }
            }
            return connections;
        }
        return this.ivaoData.connections;
    };
    /**
     * @description Get all world servers.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoServersAll();
     * ```
     */
    IvaoClient.prototype.getIvaoServersAll = function () {
        var _a;
        return (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.servers;
    };
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
    IvaoClient.prototype.getIvaoServersFiltered = function (options) {
        var _a;
        if (!((_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.servers)) {
            return undefined;
        }
        var servers = this.ivaoData.servers;
        var filter = options || {};
        if (!filter)
            return servers;
        servers = servers.filter(function (server) {
            for (var key in filter) {
                if (server[key] === undefined ||
                    server[key] !== filter[key]) {
                    return false;
                }
            }
            return true;
        });
        return servers;
    };
    /**
     * @description Get all voice servers.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const servers = client.getIvaoVoiceServersAll();
     * ```
     */
    IvaoClient.prototype.getIvaoVoiceServersAll = function () {
        var _a;
        return (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.voiceServers;
    };
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
    IvaoClient.prototype.getIvaoVoiceServersFiltered = function (options) {
        var _a;
        if (!((_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.voiceServers)) {
            return undefined;
        }
        var servers = this.ivaoData.voiceServers;
        var filter = options || {};
        if (!filter)
            return servers;
        servers = servers.filter(function (server) {
            for (var key in filter) {
                if (server[key] === undefined ||
                    server[key] !== filter[key]) {
                    return false;
                }
            }
            return true;
        });
        return servers;
    };
    /**
     * @description Get all clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const clients = client.getIvaoClientsAll();
     * ```
     */
    IvaoClient.prototype.getIvaoClientsAll = function () {
        var _a;
        return (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients;
    };
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
    IvaoClient.prototype.getIvaoClientsFiltered = function (options) {
        var _this = this;
        var _a;
        if (!((_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients))
            return undefined;
        if (options === null || options === void 0 ? void 0 : options.query) {
            var clients_1 = {};
            options.query.forEach(function (query) {
                var _a, _b;
                if (query.keys) {
                    var keys = query.keys;
                    for (var key in (_a = _this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) {
                        if (keys.includes(key)) {
                            // @ts-ignore
                            clients_1[key] = _this.ivaoData.clients[key];
                            if (query.limit) {
                                // @ts-ignore
                                clients_1[key] = (_b = clients_1[key]) === null || _b === void 0 ? void 0 : _b.slice(0, query.limit);
                            }
                        }
                    }
                }
            });
            return clients_1;
        }
        return this.ivaoData.clients;
    };
    /**
     * @description Get all pilot clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const pilots = client.getIvaoPilotsAll();
     * ```
     */
    IvaoClient.prototype.getIvaoPilotsAll = function () {
        var _a, _b;
        return (_b = (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) === null || _b === void 0 ? void 0 : _b.pilots;
    };
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
    IvaoClient.prototype.getIvaoPilotsFiltered = function (options) {
        var _a, _b;
        if (!((_b = (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) === null || _b === void 0 ? void 0 : _b.pilots))
            return undefined;
        var filter = options || {};
        var filteredPilots = this.ivaoData.clients.pilots;
        if (filter.lastTrack) {
            filteredPilots = filteredPilots.filter(function (pilot) {
                var lastTrack = pilot.lastTrack;
                if (!lastTrack) {
                    return false;
                }
                for (var prop in filter.lastTrack) {
                    if (lastTrack[prop] !== filter.lastTrack[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (filter.flightPlan) {
            if (filter.flightPlan.aircraft) {
                filteredPilots = filteredPilots.filter(function (pilot) {
                    var aircraft = pilot.flightPlan.aircraft;
                    if (!aircraft)
                        return false;
                    for (var prop in filter.flightPlan.aircraft) {
                        if (aircraft[prop] !==
                            filter.flightPlan.aircraft[prop]) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            filteredPilots = filteredPilots.filter(function (pilot) {
                var flightPlan = pilot.flightPlan;
                if (!flightPlan)
                    return false;
                for (var prop in filter.flightPlan) {
                    if (typeof flightPlan[prop] === 'object')
                        continue;
                    if (flightPlan[prop] !== filter.flightPlan[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (filter.pilotSession) {
            filteredPilots = filteredPilots.filter(function (pilot) {
                var pilotSession = pilot.pilotSession;
                if (!pilotSession)
                    return false;
                for (var prop in filter.pilotSession) {
                    if (pilotSession[prop] !==
                        filter.pilotSession[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        filteredPilots = filteredPilots.filter(function (pilot) {
            for (var prop in filter) {
                if (prop === 'limit')
                    continue;
                if (typeof pilot[prop] === 'object')
                    continue;
                if (pilot[prop] !== filter[prop]) {
                    return false;
                }
            }
            return true;
        });
        if (filter.limit && filteredPilots.length > filter.limit) {
            filteredPilots = filteredPilots.slice(0, filter.limit);
        }
        return filteredPilots;
    };
    /**
     * @description Get all ATC clients connected to the network.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * const atcs = client.getIvaoAtcsAll();
     * ```
     */
    IvaoClient.prototype.getIvaoAtcsAll = function () {
        var _a, _b;
        return (_b = (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) === null || _b === void 0 ? void 0 : _b.atcs;
    };
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
    IvaoClient.prototype.getIvaoAtcsFiltered = function (options) {
        var _a, _b;
        if (!((_b = (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) === null || _b === void 0 ? void 0 : _b.atcs))
            return undefined;
        var filter = options || {};
        var filteredAtcs = this.ivaoData.clients.atcs;
        if (filter.lastTrack) {
            filteredAtcs = filteredAtcs.filter(function (atc) {
                var lastTrack = atc.lastTrack;
                if (!lastTrack) {
                    return false;
                }
                for (var prop in filter.lastTrack) {
                    if (lastTrack[prop] !== filter.lastTrack[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (filter.atcSession) {
            filteredAtcs = filteredAtcs.filter(function (atc) {
                var atcSession = atc.atcSession;
                if (!atcSession)
                    return false;
                for (var prop in filter.atcSession) {
                    if (atcSession[prop] !== filter.atcSession[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (filter.atis) {
            filteredAtcs = filteredAtcs.filter(function (atc) {
                var atis = atc.atis;
                if (!atis)
                    return false;
                for (var prop in filter.atis) {
                    if (atis[prop] !== filter.atis[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        filteredAtcs = filteredAtcs.filter(function (atc) {
            for (var prop in filter) {
                if (prop === 'limit')
                    continue;
                if (typeof atc[prop] === 'object')
                    continue;
                if (atc[prop] !== filter[prop]) {
                    return false;
                }
            }
            return true;
        });
        if (filter.limit && filteredAtcs.length > filter.limit) {
            filteredAtcs = filteredAtcs.slice(0, filter.limit);
        }
        return filteredAtcs;
    };
    /**
     * @description Get all observer clients connected to the network.
     * @example
     * ```javascript
     * const observers = client.getIvaoObserversAll();
     * ```
     */
    IvaoClient.prototype.getIvaoObserversAll = function () {
        var _a, _b;
        return (_b = (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) === null || _b === void 0 ? void 0 : _b.observers;
    };
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
    IvaoClient.prototype.getIvaoObserversFiltered = function (options) {
        var _a, _b;
        if (!((_b = (_a = this.ivaoData) === null || _a === void 0 ? void 0 : _a.clients) === null || _b === void 0 ? void 0 : _b.observers))
            return undefined;
        var filter = options || {};
        var filteredObservers = this.ivaoData.clients.observers;
        if (filter.lastTrack) {
            filteredObservers = filteredObservers.filter(function (observer) {
                var lastTrack = observer.lastTrack;
                if (!lastTrack)
                    return false;
                for (var prop in filter.lastTrack) {
                    if (lastTrack[prop] !== filter.lastTrack[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (filter.atcSession) {
            filteredObservers = filteredObservers.filter(function (observer) {
                var atcSession = observer.atcSession;
                if (!atcSession)
                    return false;
                for (var prop in filter.atcSession) {
                    if (atcSession[prop] !== filter.atcSession[prop]) {
                        return false;
                    }
                }
                return true;
            });
        }
        filteredObservers = filteredObservers.filter(function (observer) {
            for (var prop in filter) {
                if (prop === 'limit')
                    continue;
                if (typeof observer[prop] === 'object')
                    continue;
                if (observer[prop] !== filter[prop]) {
                    return false;
                }
            }
            return true;
        });
        if (filter.limit && filteredObservers.length > filter.limit) {
            filteredObservers = filteredObservers.slice(0, filter.limit);
        }
        return filteredObservers;
    };
    /**
     * @description Kills the current client instance and clears the data.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * client.kill();
     * ```
     */
    IvaoClient.prototype.kill = function () {
        this.logger.log({
            level: 'info',
            message: 'IvaoClient: killing client',
        });
        clearInterval(this.dataRefreshRate);
        this.ivaoData = null;
        this.logger.close();
        this.isRunning = false;
    };
    /**
     * @description Restarts the client instance.
     * @example
     * ```javascript
     * const client = new IvaoClient();
     * client.restart();
     * ```
     */
    IvaoClient.prototype.restart = function () {
        var _this = this;
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
            .then(function (data) {
            _this.ivaoData = data;
            _this.logger.log({
                level: 'info',
                message: 'IvaoClient: initial data fetched',
            });
        })
            .catch(function (error) {
            _this.logger.log({
                level: 'error',
                message: error.message,
            });
        });
    };
    IvaoClient.prototype.initLogger = function () {
        var logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
        });
        // if we're not in production, log to console
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
        return logger;
    };
    return IvaoClient;
}(tiny_typed_emitter_1.TypedEmitter));
exports.IvaoClient = IvaoClient;
