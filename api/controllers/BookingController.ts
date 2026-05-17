import { APIRequestContext } from '@playwright/test';
import { BookingFactory } from '../../api/data/BookingFactory.js';

export class BookingController {
    static readonly INVALID_TOKEN = 'invalid-token-123';
    
    private request: APIRequestContext

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createBooking(payload: any, options: any = {}) {
        return await this.request.post('/booking', {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers // can override headers in the future if needed
            },
            ...options
        });
    }

    async getBookingById(bookingId: number | string) {
        return await this.request.get(`/booking/${bookingId}`);
    }

    async getBookingIdsByDate(start: string, end: string): Promise<number[]> {
        const response = await this.getBookingByDate(start, end);
        const body = await response.json();
        return body.map((b: { bookingid: number }) => b.bookingid);
    }

    async getBookingByName(firstName: string, lastName: string) {
        return await this.request.get('/booking', {
            params: { firstname: firstName, lastname: lastName }
        });
    }

    async getBookingByDate(checkIn: string, CheckOut: string) {
        return await this.request.get('/booking', {
            params: { checkin: checkIn, checkout: CheckOut }
        });
    }

    async login(payload: any, options: any = {}) {
        return await this.request.post('/auth', {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers // can override headers in the future if needed
            },
            ...options
        });
    }

    async getAuthToken() {
        const payload = BookingFactory.createValidLoginPayload();
        const response = await this.login(payload);
        const body = await response.json();
        return body.token;
    }

    async entireBookingUpdate(bookingId: number | string, payload: any, token: string, options: any = {}) {
        return await this.request.put(`/booking/${bookingId}`, {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`,
                ...options.headers
            },
            ...options
        });
    }

    async partialBookingUpdate(bookingId: number | string, payload: any, token: string, options: any = {}) {
        return await this.request.patch(`/booking/${bookingId}`, {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`,
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        });
    }

    async deleteBooking(bookingId: number | string, token: string, options: any = {}) {
        return await this.request.delete(`/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`,
                ...options.headers
            },
            ...options
        });
    }
}