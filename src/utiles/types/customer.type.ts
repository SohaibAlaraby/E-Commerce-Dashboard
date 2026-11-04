export interface CustomerHair {
  color: string;
  type: string;
}
export interface GeoCoordinates {
  lat: number;
  lng: number;
}
export interface CustomerAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: GeoCoordinates;
  country: string;
}
export interface CustomerBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}
export interface CustomerCompany {
  department: string;
  name: string;
  title: string;
  address: CustomerAddress;
}
export interface CustomerCrypto {
  coin: string;
  wallet: string;
  network: string;
}
export interface CustomerReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: 'male' | 'female' | string;
  email: string;
  phone: string;
  username: string;
  password?: string; // اختياري في حالة عدم الحفاظ على كلمة المرور في الـ Frontend
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: CustomerHair;
  ip: string;
  address: CustomerAddress;
  macAddress: string;
  university: string;
  bank: CustomerBank;
  company: CustomerCompany;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: CustomerCrypto;
  role: 'admin' | 'moderator' | 'user' | string;
}