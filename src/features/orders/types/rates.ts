export interface IShippoRate {
  object_id: string;
  object_created: string;
  object_owner: string;

  amount: string;
  amount_local: string;
  currency: string;
  currency_local: string;

  provider: string;
  provider_image_75: string;
  provider_image_200: string;

  carrier_account: string;
  shipment: string;

  estimated_days: number | null;
  arrives_by: string | null;
  duration_terms: string;

  attributes: string[];
  messages: IShippoRateMessage[];

  included_insurance_price: string | null;

  zone: string;
  test: boolean;

  servicelevel: IShippoServiceLevel;
}

export interface IShippoServiceLevel {
  name: string;
  token: string;
  terms: string;
  extended_token: string;
  display_name: string | null;
}

export interface IShippoRateMessage {
  code?: string;
  source?: string;
  text?: string;
  type?: string;
}