export interface Address {
  id: number;
  city: string;
  country: string;
  state: string;
  street: string;
  zipCode: string;
  isDefault: boolean;
}

export interface CreateAddressDto {
  city: string;
  country: string;
  state: string;
  street: string;
  zipCode: string;
  isDefault?: boolean;
}
