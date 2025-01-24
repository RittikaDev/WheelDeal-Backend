export interface ICarGalleryImage {
  url: string;
}

export interface ICar {
  name: string;
  description: string;
  image: string;
  brand: string;
  model: string;
  type: string;
  category: string;
  year: number;
  color: string;
  seatCapacity: number;
  mileage: number;
  mileageUnit: 'kilometers' | 'miles';
  isElectric: boolean;
  moreImages: ICarGalleryImage[];
  features: string[];
  pricePerHour: number;
  transmission: 'automatic' | 'manual';
  status: 'available' | 'unavailable';
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
