export interface ValidationResults {
    createdAt: string;
    updatedAt: string;
}

export interface IAddress {
    address_object_id: string;
    name: string;
    company?: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
    is_residential: boolean;
    metadata: string;
    shopUrl: string;
    validation_results?: ValidationResults;
}