import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingFactory } from '../../api/data/BookingFactory';
import { BookingController } from '../../api/controllers/BookingController';
import { validateBookingData } from '../../api/utils/bookingAssertions';


test.describe('Update Booking - Positive', () => {

    test('Update entire booking with valid auth token', async ({ bookingController, bookingDetails }) => {
        const bookingId = bookingDetails.bookingid;
        const authToken = await bookingController.getAuthToken();

        const updateEntireBookingRequestBody = BookingFactory.createValidPayload();
        const updateBookingResponse = await bookingController.entireBookingUpdate(
            bookingId, updateEntireBookingRequestBody, authToken
        );
        const updateBookingResponseBody = await updateBookingResponse.json();

        expect(updateBookingResponse.ok()).toBeTruthy();
        expect(updateBookingResponse.status()).toBe(200);
        validateBookingData(updateBookingResponseBody, updateEntireBookingRequestBody);
    });

    test('Update name in booking with valid auth token', async ({ bookingController, bookingDetails }) => {
        const bookingId = bookingDetails.bookingid;
        const authToken = await bookingController.getAuthToken();
        const updateBookingNameRequestBody = BookingFactory.createPayloadWithNameOnly();
        const currentBookingResponse = await bookingController.getBookingById(bookingId);
        const currentBookingResponseBody = await currentBookingResponse.json();
        const updateBookingResponse = await bookingController.partialBookingUpdate(
            bookingId, updateBookingNameRequestBody, authToken
        );
        const updateBookingResponseBody = await updateBookingResponse.json();
        const expectedUpdatedBooking = { ...currentBookingResponseBody, ...updateBookingNameRequestBody };

        expect(updateBookingResponse.ok()).toBeTruthy();
        expect(updateBookingResponse.status()).toBe(200);
        validateBookingData(updateBookingResponseBody, expectedUpdatedBooking);
    });
});
test.describe('Update of Booking - Negative', () => {

    test('Should return 403 when updating entire booking with invalid auth token', async ({ bookingController, bookingDetails }) => {
        const bookingId = bookingDetails.bookingid;
        const updateEntireBookingRequestBody = BookingFactory.createValidPayload();
        const updateEntireBookingResponseInvalidToken = await bookingController.entireBookingUpdate(
            bookingId, updateEntireBookingRequestBody, BookingController.INVALID_TOKEN
        );

        expect(updateEntireBookingResponseInvalidToken.status()).toBe(403);
    });

    test('Should return 400 when sending a malformed payload when updating entire booking', async (
        { bookingController, bookingDetails }
    ) => {
        const bookingId = bookingDetails.bookingid;
        const authToken = await bookingController.getAuthToken();
        const updateEntireBookingMalformedPalyoadRequestBody: any = `{
        "firstname" : "Jim5",
        "lastname" : "Brown5",
        "totalprice" : 111,
        "depositpaid" : true,
        "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
        },
        "additionalneeds" : "Breakfast"
    `;
        const updateEntireBookingMalformedPalyoad = await bookingController.entireBookingUpdate(
            bookingId, updateEntireBookingMalformedPalyoadRequestBody, authToken
        );

        expect(updateEntireBookingMalformedPalyoad.status()).toBe(400);
    });

    test('Should return 403 when updating name in booking with invalid auth token', async ({ bookingController, bookingDetails }) => {
        const bookingId = bookingDetails.bookingid;
        const updateBookingNameRequestBody = BookingFactory.createPayloadWithNameOnly();
        const updateBookingNameResponseInvalidToken = await bookingController.partialBookingUpdate(
            bookingId, updateBookingNameRequestBody, BookingController.INVALID_TOKEN
        );

        expect(updateBookingNameResponseInvalidToken.status()).toBe(403);
    });

    test('Should return 400 when sending a malformed payload when updating name in booking', async (
        { bookingController, bookingDetails }
    ) => {
        const bookingId = bookingDetails.bookingid;
        const authToken = await bookingController.getAuthToken();
        const updateBookingNameMalformedPalyoadRequestBody: any = `{
        "firstname" : "Jim5",
        "lastname" : "Brown5",
    `;
        const updateBookingNameMalformedPalyoadResponse = await bookingController.partialBookingUpdate(
            bookingId, updateBookingNameMalformedPalyoadRequestBody, authToken
        );

        expect(updateBookingNameMalformedPalyoadResponse.status()).toBe(400);
    });
});