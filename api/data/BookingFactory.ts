import { de, faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

export class BookingFactory {

        // Create date in correct format
    static formatRelativeDate(isoString: string, daysOffset: number): string {
        return DateTime.fromISO(isoString).plus({ days: daysOffset }).toFormat('yyyy-MM-dd');
    }

    // The standard valid payload
    static createValidPayload() {
        const amenities = [
            'Breakfast',
            'Late Checkout',
            'Extra Pillow',
            'Parking',
            'Gym Access',
            'Wi-Fi'];
        
        const currentIsoString = DateTime.now().toISO()!;

        return {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            totalprice: faker.number.int({ min: 100, max: 5000 }),
            depositpaid: faker.datatype.boolean(),
            bookingdates: {
                checkin: this.formatRelativeDate(currentIsoString, 0),
                checkout: this.formatRelativeDate(currentIsoString, 5)
            },
            additionalneeds: faker.helpers.arrayElement(amenities)
        };
    }

    // A payload with a missing mandatory field
    static createPayloadWithMissingLastname() {
        const payload = this.createValidPayload();
        delete payload.lastname;
        return payload;
    }

    // A payload with incorrect data types
    static createPayloadWithInvalidTypes() {
        return {
            firstname: 12345, // Number instead of string
            lastname: faker.person.lastName(),
            totalprice: 'Free', // String instead of number
            depositpaid: 'Yes', // String instead of boolean
            bookingdates: {
                checkin: 'not-a-date',
                checkout: 'soon'
            }
        };
    }

    // A payload with a missing mandatory field
    static createPayloadWithNameOnly() {
        return {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName()
        }
    }

    // A payload with valid login credentails
    static createValidLoginPayload() {
        return {
            "username": process.env.BOOKING_USER,
            "password": process.env.BOOKING_PASSWORD
        }
    }

    // A payload with invalid login credentials
    static createInvalidLoginPayload() {
        return {
            "username": process.env.BOOKING_USER,
            "password": 'invalidPassword'
        }
    }
}