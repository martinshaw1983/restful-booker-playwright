import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingFactory } from '../../api/data/BookingFactory';
import { validateBookingData } from '../../api/utils/bookingAssertions';

test.describe('Post Bookings - Positive', () => {

    test('Should return 200 or a successful booking', async ({ bookingController }) => {
        const newBookingRequestBody = BookingFactory.createValidPayload();
        const newBookingResponse = await bookingController.createBooking(newBookingRequestBody);
        const newBookingResponseBody: any = await newBookingResponse.json();
        const booking: any = newBookingResponseBody.booking;

        expect(newBookingResponse.ok()).toBeTruthy();
        expect(newBookingResponse.status()).toBe(200);

        expect(newBookingResponseBody).toHaveProperty('bookingid');
        expect(newBookingResponseBody).toHaveProperty('booking');
        validateBookingData(booking, newBookingRequestBody);
    });
});

test.describe('Post Bookings - Negative', () => {

    test('Should return 500 when sending a completely empty payload', async ({ bookingController }) => {
        const newBookingEmptyResponse  = await bookingController.createBooking({});

        expect(newBookingEmptyResponse.status()).toBe(500);
    });

    test('Should return 500 when mandatory fields are missing', async ({ bookingController }) => {
        const newBookingMissingFieldsRequestBody = BookingFactory.createPayloadWithMissingLastname();

        const newBookingMissingFiledsResponse = await bookingController.createBooking(
            newBookingMissingFieldsRequestBody)
            ;

        expect(newBookingMissingFiledsResponse.status()).toBe(500);
    });

    test('Should return 500 when sending invalid data types in payload', async ({ bookingController }) => {
        const newBookingInvalidDataRequestBody = BookingFactory.createPayloadWithInvalidTypes();
        const newBookingInvalidDataResponse = await bookingController.createBooking(newBookingInvalidDataRequestBody);

        expect(newBookingInvalidDataResponse.status()).toBe(500);
    });

    test('Should return 400 when sending a malformed payload', async ({ bookingController }) => {
        const newBookingMalformedPalyoadRequestBody: any = `{
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

        const newBookingMalformedPayloadResponse = await bookingController.createBooking(
            newBookingMalformedPalyoadRequestBody
        );

        expect(newBookingMalformedPayloadResponse.status()).toBe(400);
    });
});