import { test as base } from '@playwright/test';
import { BookingController } from '../controllers/BookingController';
import { BookingFactory } from '../data/BookingFactory';
export { expect } from '@playwright/test';

type MyFixtures = {
    bookingController: BookingController;
    bookingDetails: any;
};

export const test = base.extend<MyFixtures>({
    // Automatically instantiate the controller for every test using this fixture
    bookingController: async ({ request }, use) => {
        const controller = new BookingController(request);
        await use(controller);
    },

    bookingDetails: async ({ bookingController }, use: any) => {
        // Logic that creates a pre test booking using the controller directly
        const payload = BookingFactory.createValidPayload();
        const newBooking = await bookingController.createBooking(payload);
        const bookingData = await newBooking.json();

        // This passes the date to the test file
        await use(bookingData);

        // Post test teardown
        try {
            await bookingController.deleteBooking(bookingData.bookingId);
        } catch (error) {
            console.log(`Teardown skipped, booking ${bookingData.bookingId} was already deleted`);
        }
    }
});