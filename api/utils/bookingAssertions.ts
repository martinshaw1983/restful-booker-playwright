import { expect } from "@playwright/test";

export function validateBookingData(actualBooking: any, expectedBooking: any) {
    expect(actualBooking).toMatchObject({
        "firstname": expectedBooking.firstname,
        "lastname": expectedBooking.lastname,
        "totalprice": expectedBooking.totalprice,
        "depositpaid": expectedBooking.depositpaid,
        "additionalneeds": expectedBooking.additionalneeds

    });

    expect(actualBooking.bookingdates).toMatchObject({
        "checkin": expectedBooking.bookingdates.checkin,
        "checkout": expectedBooking.bookingdates.checkout
    });
};