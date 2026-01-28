import { API_BASE_URL, API_ENDPOINTS } from '../constants/config';

// Driver type matching backend schema
export interface Driver {
    id: number;
    carReg: string;
    name: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    session: string;
}

// Input type for creating a driver
export interface CreateDriverInput {
    carReg: string;
    name: string;
    phoneNumber: string;
    longitude?: number;
    latitude?: number;
}

// API Response types
interface ApiError {
    error: string;
    details?: unknown;
}

class DriverService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Create a new driver
    async createDriver(data: CreateDriverInput): Promise<Driver> {
        const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DRIVERS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error || 'Failed to create driver');
        }

        return response.json();
    }

    // Get all drivers
    async getDrivers(): Promise<Driver[]> {
        const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DRIVERS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch drivers');
        }

        return response.json();
    }

    // Get driver by ID
    async getDriverById(id: number): Promise<Driver | null> {
        const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DRIVER_BY_ID(id)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch driver');
        }

        return response.json();
    }

    // Update driver by ID
    async updateDriver(id: number, data: Partial<Omit<Driver, 'id'>>): Promise<Driver> {
        const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DRIVER_BY_ID(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.error || 'Failed to update driver');
        }

        return response.json();
    }

    // Verify driver by session
    async verifyDriverBySession(session: string, name: string, phoneNumber: string): Promise<Driver | null> {
        try {
            const drivers = await this.getDrivers();
            const matchedDriver = drivers.find(
                driver =>
                    driver.session === session &&
                    driver.name.toLowerCase() === name.toLowerCase() &&
                    driver.phoneNumber === phoneNumber
            );
            return matchedDriver || null;
        } catch (error) {
            console.error('Error verifying driver:', error);
            return null;
        }
    }

    // Update driver location
    async updateDriverLocation(id: number, latitude: number, longitude: number): Promise<Driver> {
        return this.updateDriver(id, { latitude, longitude });
    }
}

export const driverService = new DriverService();
