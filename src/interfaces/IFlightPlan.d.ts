import { IAircraft } from './IAircraft';
export interface IFlightPlan {
    id: number;
    revision: number;
    aircraftId: string;
    aircraftNumber: string;
    departureId: string;
    arrivalId: string;
    alternativeId: string;
    alternative2Id: string;
    route: string;
    remarks: string;
    speed: string;
    level: string;
    flightRules: string;
    flightType: string;
    eet: number;
    endurance: number;
    departureTime: number;
    actualDepartureTime: number;
    peopleOnBoard: number;
    createdAt: string;
    updatedAt: string;
    aircraftEquipment: string;
    aircraftTransponderTypes: string;
    aircraft: IAircraft;
}
