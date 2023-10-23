import { setupTest } from '../integration-tests/helpers';
import { userSuccessfullyUpdatesEmailAddress } from '../integration-tests/journey/userSuccessfullyUpdatesEmailAddress';
import { userVerifiesUpdatedEmailAddress } from '../integration-tests/journey/userVerifiesUpdatedEmailAddress';

const { faker } = require('@faker-js/faker');

describe('Petitioner creates new account', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const userName = `${faker.internet.userName()}@example.com`;
  const updatedEmailAddress = `${faker.internet.userName()}@example.com`;
  const name = 'Test Petitioner Cognito';
  const password = 'abc123';
  const standardizedConfirmationCode = 123456;
  const expectedVerificationLink = `/confirm-signup-local?confirmationCode=${standardizedConfirmationCode}&email=${userName}`;

  it('petitioner creates a new account', async () => {
    await cerebralTest.runSequence('goToCreateAccountLocalSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'name',
      value: name,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    await cerebralTest.runSequence('createNewAccountLocalSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('LogIn');

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      linkText: 'Verify Email',
      linkUrl: expectedVerificationLink,
      message: `New user account created successfully for ${userName}! Please click the link below to verify your email address.`,
      newTab: false,
    });
  });

  it('petitioner follows verification link to confirm new account', async () => {
    await cerebralTest.runSequence('navigateToPathSequence', {
      path: expectedVerificationLink,
    });
    expect(cerebralTest.getState('alertSuccess')).toEqual(
      expect.objectContaining({
        message:
          'Your registration has been confirmed! You will be redirected shortly!',
      }),
    );
  });

  it('petitioner logs in successfully', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: userName,
      password,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('user.email')).toEqual(userName);
  });

  userSuccessfullyUpdatesEmailAddress(
    cerebralTest,
    'petitioner',
    updatedEmailAddress,
  );
  userVerifiesUpdatedEmailAddress(cerebralTest, 'petitioner');

  it('petitioner logs in with new email address', async () => {
    await cerebralTest.runSequence('signOutSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: updatedEmailAddress,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: updatedEmailAddress,
      password,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('user.email')).toEqual(updatedEmailAddress);
  });
});
