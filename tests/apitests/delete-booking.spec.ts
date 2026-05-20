import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingController } from '../../api/controllers/BookingController';

test.describe('Delete Booking - Positive', () => {

    test('Should delete a booking with a valid auth token', async ({ bookingController, bookingDetails, apiAuthConfg }) => {
        const bookingId: number = bookingDetails.bookingid;
        const authToken = await bookingController.getAuthToken(apiAuthConfg.username, apiAuthConfg.validPassword);
        const deleteResponse = await bookingController.deleteBooking(bookingId, authToken);
        const searchBookingIdResponse = await bookingController.getBookingById(bookingId);

        expect(deleteResponse.status()).toBe(201);
        expect(searchBookingIdResponse.status()).toBe(404);
    });
});

test.describe('Delete Booking - Negative', () => {

    test('Should not delete a booking with a invalid auth token', async ({ bookingController, bookingDetails, apiAuthConfg }) => {
        const bookingId: number = bookingDetails.bookingid;
        const deleteResponse = await bookingController.deleteBooking(bookingId, apiAuthConfg.invalidToken);
        const searchBookingIdResponse = await bookingController.getBookingById(bookingId);
        const searchBookingIdResponseBody = await searchBookingIdResponse.json();

        expect(deleteResponse.status()).toBe(403);
        expect(searchBookingIdResponse.status()).toBe(200);
        expect(searchBookingIdResponseBody).toHaveProperty('firstname');
    });
});