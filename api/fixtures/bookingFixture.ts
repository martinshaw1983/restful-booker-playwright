import { test as base } from '@playwright/test';
import { BookingController } from '../controllers/BookingController';
import { BookingFactory } from '../data/BookingFactory';
export { expect } from '@playwright/test';

type ApiAuthConfig = {
    username: string;
    validPassword: string;
    invalidPassword: string;
    invalidToken: string
};

type MyFixtures = {
    apiAuthConfg: ApiAuthConfig;
    bookingController: BookingController;
    bookingDetails: any;
};

export const test = base.extend<MyFixtures>({
    //
    apiAuthConfg: async ({}, use) => {
        // This sets the loging credentials
        await use({
            username: process.env.BOOKING_USER || '',
            validPassword: process.env.BOOKING_PASSWORD || '',
            invalidPassword: process.env.INVALID_PASSWORD || '',
            invalidToken: process.env.INVALID_TOKEN || '',
        });
    },
    // Automatically instantiated the controller for every test using this fixture
    bookingController: async ({ request }, use) => {
        const controller = new BookingController(request);
        await use(controller);
    },

    bookingDetails: async ({ bookingController }, use: any) => {
        // Logic that creates a pre test booking using the controller directly
        const payload = BookingFactory.createValidPayload();
        const newBooking = await bookingController.createBooking(payload);
        const bookingData = await newBooking.json();

        // This passes the data to the test file
        await use(bookingData);

        // Post test teardown steps
        try {
            await bookingController.deleteBooking(bookingData.bookingId);
        } catch (error) {
            console.log(`Teardown skipped, booking ${bookingData.bookingId} was already deleted`);
        }
    }
});