export interface CreateShipmentDTO {
    address_to: string;
    address_from: string;

    parcels: IParcels[]

}

export interface IParcels {
  length?: string;       
  width?: string;
  height?: string;
  weight?: string;
  distance_unit?: string;
  mass_unit?: string;
}