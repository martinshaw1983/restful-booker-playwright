import { test, expect } from '../../api/fixtures/bookingFixture';
import { DateTime } from 'luxon';


test.describe('Get Bookings - Positive', () => {

    test('Should return 200 for an existing ID', async ({ bookingController, bookingDetails }) => {
        // Sending get request with path parameter
        const bookingIdSearchResponse = await bookingController.getBookingById(bookingDetails.bookingid);

        // Parse the response and print
        const bookingIdSearchResponseBody = await bookingIdSearchResponse.json();

        // Add assertions
        expect(bookingIdSearchResponse.ok()).toBeTruthy();
        expect(bookingIdSearchResponse.status()).toBe(200);
        expect(bookingIdSearchResponseBody).toMatchObject({
            "firstname": expect.any(String),
            "lastname": expect.any(String),
            "totalprice": expect.any(Number),
            "depositpaid": expect.any(Boolean),
            "additionalneeds": expect.any(String)
        });
    });


    test('Should return results when filtering by valid name', async ({ bookingController, bookingDetails }) => {
        const firstName: string = bookingDetails.booking.firstname;
        const lastName: string = bookingDetails.booking.lastname;

        // Sending get request with query parameter
        const nameSearchresponse = await bookingController.getBookingByName(firstName, lastName);

        // Parse the response and print
        const nameSearchResponseBody = await nameSearchresponse.json();

        // Add assertions
        expect(nameSearchresponse.ok()).toBeTruthy();

        // Check response should not be empty
        expect(nameSearchResponseBody.length).toBeLessThan(20);

        for (const item of nameSearchResponseBody) {
            expect(item).toHaveProperty('bookingid');
            expect(typeof item.bookingid).toBe('number');
           expect(item.bookingid).toBeGreaterThan(0);
        }
    });


    test('Should return results when filtering by valid dates', async ({ bookingController, bookingDetails }) => {
        const checkIn: string = DateTime.fromISO(bookingDetails.booking.bookingdates.checkin).minus({ days: 1 }).toFormat('yyyy-MM-dd');
        const checkOut: string = DateTime.fromISO(bookingDetails.booking.bookingdates.checkout).plus({ days: 1 }).toFormat('yyyy-MM-dd');

        // Sending get request with query parameter
        const dateSearchResponse = await bookingController.getBookingByDate(checkIn, checkOut);

        // Parse the response and print
        const dateSearchResponseBody = await dateSearchResponse.json();

        // Add assertions
        expect(dateSearchResponse.ok()).toBeTruthy();
        expect(dateSearchResponse.status()).toBe(200);

        // Check response should not be empty
        expect(dateSearchResponseBody.length).toBeLessThan(300);

        for (const item of dateSearchResponseBody) {
            expect(item).toHaveProperty('bookingid');
            expect(typeof item.bookingid).toBe('number');
            expect(item.bookingid).toBeGreaterThan(0);
        }
    });
});

test.describe('Get Booking - Negative', () => {
    test('Should return 404 for a non-existent ID', async ({ bookingController, bookingDetails }) => {
        const bokingIdNegativeResponse = await bookingController.getBookingById(999999999999999);
        expect(bokingIdNegativeResponse.status()).toBe(404);
    });

    test('should return 404 when passing a string instead of a numeric ID', async ({ bookingController, bookingDetails }) => {
        const bookingIdNegativeResponse: any = await bookingController.getBookingById('abc');
        expect(bookingIdNegativeResponse.status()).toBe(404);
    });
});