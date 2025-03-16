import { IPropertybase } from './IPropertybase';

export class Property implements IPropertybase {
    Id: number = 0;
    SellRent: number | null = null;
    Name: string = '';
    PType: string = '';
    FType: string = '';
    Price: number | null = null;
    BHK: number = 0;
    BuiltArea: number = 0;
    City: string = '';
    RTM: number = 0;
    Address: string = '';
    ImageUrl: string = '';
    Landmark: string = '';
    Floor: number = 0;
    TotalFloors: number = 0;
    Age: number = 0;
    Description: string = '';
    Type: string = '';

    // Additional properties not in base interface
    CarpetArea?: number;
    Address2?: string;
    Security?: number;
    Maintenance?: number;
    GatedCommunity?: string;
    MainEntrance?: string;
    PossessionDate?: string;
    PostedOn?: string;
    PostedBy?: number;
}
