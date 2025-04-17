export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern ecommerce store built with Next.js';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

  export const signInDefaultValues={
    email:'',
    password:''
  };


  export const shippingAddressDefaultValues = {
    fullName: '',
    phoneNumber: '',  // Example phone number
    streetAddress: '',
    city: '',
    postalCode: '',
    state: '',  // Default state for the user
    country: '',
    lat:'' , // Latitude for New York
    lng: '', // Longitude for New York
  };
  