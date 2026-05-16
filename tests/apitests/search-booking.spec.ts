import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingFactory } from '../../api/data/BookingFactory';
import { DateTime } from 'luxon';

test.describe('Get Bookings - Positive', () => {

    test('Should return 200 for an existing ID', async ({ bookingController, bookingDetails }) => {
        const bookingIdSearchResponse = await bookingController.getBookingById(bookingDetails.bookingid);
        const bookingIdSearchResponseBody = await bookingIdSearchResponse.json();

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

    test('Should validate booking presence and absence based on name filters', async ({ bookingController, bookingDetails }) => {

        await test.step('Verify booking is present when searching for a valid name', async () => {
            const firstName: string = bookingDetails.booking.firstname;
            const lastName: string = bookingDetails.booking.lastname;
            const validNameSearchresponse = await bookingController.getBookingByName(firstName, lastName);
            const validNameSearchResponseBody = await validNameSearchresponse.json();

            expect(validNameSearchresponse.ok()).toBeTruthy();
            expect(validNameSearchResponseBody.length).toBeLessThan(20);
            expect(validNameSearchResponseBody.map((b: { bookingid: number }) => b.bookingid)).toContain(bookingDetails.bookingid);

            for (const item of validNameSearchResponseBody) {
                expect(item).toHaveProperty('bookingid');
                expect(typeof item.bookingid).toBe('number');
                expect(item.bookingid).toBeGreaterThan(0);
            }
        });

        await test.step('Verify booking is absent when searching for a invalid name', async () => {
            const invalidNameSearchresponse = await bookingController.getBookingByName('ZzXyWw_Invalid', 'Nonsense_Lname');
            const invalidNameSearchresponseBody = await invalidNameSearchresponse.json();

            expect(invalidNameSearchresponseBody.length).toBe(0);
        });

    });

    test('Should validate booking presence and absence based on date filters', async ({ bookingController, bookingDetails }) => {
        const validCheckIn: string = BookingFactory.formatRelativeDate(bookingDetails.booking.bookingdates.checkin, -1);
        const validCheckOut: string = BookingFactory.formatRelativeDate(bookingDetails.booking.bookingdates.checkout, 1);

        await test.step('Verify booking is present when searching inside valid date range', async () => {
            const dateSearchResponse = await bookingController.getBookingByDate(validCheckIn, validCheckOut);
            const dateSearchResponseBody = await dateSearchResponse.json();

            expect(dateSearchResponse.ok()).toBeTruthy();
            expect(dateSearchResponse.status()).toBe(200);
            
            // Reusing your clean controller logic from earlier keeps this robust
            const matchIds = dateSearchResponseBody.map((b: { bookingid: number }) => b.bookingid);
            expect(matchIds).toContain(bookingDetails.bookingid);
        });

        await test.step('Verify booking is absent when searching future date range', async () => {
            const futureCheckIn = BookingFactory.formatRelativeDate(bookingDetails.booking.bookingdates.checkout, 1);
            const futureCheckOut = BookingFactory.formatRelativeDate(bookingDetails.booking.bookingdates.checkout, 5);
            const futureIds = await bookingController.getBookingIdsByDate(futureCheckIn, futureCheckOut);
            
            expect(futureIds).not.toContain(bookingDetails.bookingid);
        });
    });
}); 

test.describe('Get Booking - Negative', () => {
    test('Should return 404 for a non-existent ID', async ({ bookingController }) => {
        const bokingIdNegativeResponse = await bookingController.getBookingById(99999999999999);
        expect(bokingIdNegativeResponse.status()).toBe(404);
    });

    test('should return 404 when passing a string instead of a numeric ID', async ({ bookingController }) => {
        const bookingIdNegativeResponse: any = await bookingController.getBookingById('abc');
        expect(bookingIdNegativeResponse.status()).toBe(404);
    });
});