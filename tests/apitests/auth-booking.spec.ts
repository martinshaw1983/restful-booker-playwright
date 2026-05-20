import { test, expect } from '../../api/fixtures/bookingFixture';
import { BookingFactory } from '../../api/data/BookingFactory';


test.describe('Login - Positive', () => {

    test('Should return an auth token on successful login', async ({ bookingController, apiAuthConfg }) => {
        const validLoginRequestBody = BookingFactory.createLoginPayload(apiAuthConfg.username, apiAuthConfg.validPassword);
        const validLoginResponse = await bookingController.login(validLoginRequestBody);
        const validLoginResponseBody = await validLoginResponse.json();
        expect(validLoginResponse.status()).toBe(200);
        expect(validLoginResponseBody.token).toBeDefined();
    });
})

test.describe('Login - Negative', () => {

    test('Should return bad credentials on unsuccessful login', async ({ bookingController, apiAuthConfg }) => {
        const invalidLoginRequestBody = BookingFactory.createLoginPayload(apiAuthConfg.username, apiAuthConfg.invalidPassword);
        const invalidLoginResponse = await bookingController.login(invalidLoginRequestBody);
        const invalidLoginResponseBody = await invalidLoginResponse.json();
        expect(invalidLoginResponse.status()).toBe(200);
        expect(invalidLoginResponseBody.reason).toContain('Bad credentials');
    });
})

