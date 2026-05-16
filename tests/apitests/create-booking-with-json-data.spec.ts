import { test, expect } from '../../api/fixtures/bookingFixture';


test('Create POST request using static body from Json file', async ({ bookingController }) => {

    // Request body (load the JSON file)
   const { default: newBookingRequestBody } = await import('../../api/data/booking-data.json', {
        with: { type: 'json' }
    });

    // Send POST request
    const newBookingResponse = await bookingController.createBooking(newBookingRequestBody);

    const newBookingResponseBody = await newBookingResponse.json();

    // Validate status
    expect(newBookingResponse.ok()).toBeTruthy();
    expect(newBookingResponse.status()).toBe(200);

    // Validate response
    expect(newBookingResponseBody).toHaveProperty('bookingid');
    expect(newBookingResponseBody).toHaveProperty('booking');

    // Validate booking details
    const booking = newBookingResponseBody.booking
    expect(booking).toMatchObject({
        "firstname": newBookingRequestBody.firstname,
        "lastname": newBookingRequestBody.lastname,
        "totalprice": newBookingRequestBody.totalprice,
        "depositpaid": newBookingRequestBody.depositpaid,
        "additionalneeds": newBookingRequestBody.additionalneeds
    });
    
    expect(booking.bookingdates).toMatchObject({
            "checkin": newBookingRequestBody.bookingdates.checkin,
            "checkout": newBookingRequestBody.bookingdates.checkout
        });
});