import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingFactory } from '../../api/data/BookingFactory';


test.describe('Login - Positive', () => {

    test('Should return an auth token on successful login', async ({ bookingController }) => {
        const validLoginRequestBody = BookingFactory.createValidLoginPayload();
        const validLoginResponse = await bookingController.login(validLoginRequestBody);
        const validLoginResponseBody = await validLoginResponse.json();
    
        expect(validLoginResponseBody.token).toBeDefined();
    });
})

test.describe('Login - Negative', () => {

    test('Should return bad credentials on unsuccessful login', async ({ bookingController }) => {
        const invalidLoginRequestBody = BookingFactory.createInvalidLoginPayload();
        const invalidLoginResponse = await bookingController.login(invalidLoginRequestBody);
        const invalidLoginResponseBody = await invalidLoginResponse.json();
    
        expect(invalidLoginResponseBody.reason).toContain('Bad credentials');
    });
})

