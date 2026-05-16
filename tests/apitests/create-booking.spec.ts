import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingFactory } from '../../api/data/BookingFactory';
import { validateBookingData } from '../../api/utils/bookingAssertions';

test.describe('Post Bookings - Positive', () => {

    test('Should return 200 or a successful booking', async ({ bookingController }) => {
        // Request body
        const newBookingRequestBody = BookingFactory.createValidPayload();

        // Send POST request
        const newBookingResponse = await bookingController.createBooking(newBookingRequestBody);
        const newBookingResponseBody: any = await newBookingResponse.json();
        const booking: any = newBookingResponseBody.booking;

        // Validate status
        expect(newBookingResponse.ok()).toBeTruthy();
        expect(newBookingResponse.status()).toBe(200);

        // Validate response
        expect(newBookingResponseBody).toHaveProperty('bookingid');
        expect(newBookingResponseBody).toHaveProperty('booking');

        // Validate booking details
        validateBookingData(booking, newBookingRequestBody);
    });
});

test.describe('Post Bookings - Negative', () => {

    test('Should return 500 when sending a completely empty payload', async ({ bookingController }) => {
        // Send POST request
        const newBookingEmptyResponse  = await bookingController.createBooking({});

        // Validate status
        expect(newBookingEmptyResponse.status()).toBe(500);
    });

    test('Should return 500 when mandatory fields are missing', async ({ bookingController }) => {
        // Request body
        const newBookingMissingFieldsRequestBody = BookingFactory.createPayloadWithMissingLastname();

        // Send POST request
        const newBookingMissingFiledsResponse = await bookingController.createBooking(
            newBookingMissingFieldsRequestBody)
            ;

        // Validate status
        expect(newBookingMissingFiledsResponse.status()).toBe(500);
    });

    test('Should return 500 when sending invalid data types in payload', async ({ bookingController }) => {
        // Request body
        const newBookingInvalidDataRequestBody = BookingFactory.createPayloadWithInvalidTypes();

        // Send POST request
        const newBookingInvalidDataResponse = await bookingController.createBooking(newBookingInvalidDataRequestBody);

        // Validate status
        expect(newBookingInvalidDataResponse.status()).toBe(500);
    });

    test('Should return 400 when sending a malformed payload', async ({ bookingController }) => {
        // Request body
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

        // Send POST request
        const newBookingMalformedPayloadResponse = await bookingController.createBooking(
            newBookingMalformedPalyoadRequestBody
        );

        // Validate status
        expect(newBookingMalformedPayloadResponse.status()).toBe(400);
    });
});