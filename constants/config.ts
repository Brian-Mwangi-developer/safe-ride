// API Configuration
// Change this URL to your ngrok URL when deploying
export const API_BASE_URL = 'https://8729a23a5984.ngrok-free.app'; // Android emulator localhost

// For physical device, use your machine's local IP or ngrok URL
// export const API_BASE_URL = 'https://your-ngrok-url.ngrok.io';

// API Endpoints
export const API_ENDPOINTS = {
    DRIVERS: '/api/driver',
    DRIVER_BY_ID: (id: number) => `/api/driver/${id}`,
};

// Verification link prefix
export const VERIFICATION_LINK_PREFIX = 'saferide://verify?session=';

// AsyncStorage Keys
export const STORAGE_KEYS = {
    DRIVER_SESSION: 'driver_session',
    DRIVER_VERIFIED: 'driver_verified',
    DRIVER_ID: 'driver_id',
    DRIVER_DATA: 'driver_data',
};
