import { faker } from '@faker-js/faker';
import { setupTest as setupTestPrivate } from './helpers';
import { setupTest as setupTestPublic } from '../integration-tests-public/helpers';
import { userSuccessfullyUpdatesEmailAddress } from './journey/userSuccessfullyUpdatesEmailAddress';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';

// TODO: 10007 - we need to implement force password change
describe.skip('Petitioner creates new account', () => {
  const cerebralTestPrivate = setupTestPrivate();
  const cerebralTestPublic = setupTestPublic();

  afterAll(() => {
    cerebralTestPrivate.closeSocket();
  });

  const userName = `${faker.internet.userName()}@example.com`.toLowerCase();
  const updatedEmailAddress = `${faker.internet.userName()}@example.com`;
  const name = 'Test Petitioner Cognito';
  const password = 'aA1!aaaa';
  const standardizedConfirmationCode = '123456';
  const expectedVerificationLink = `/confirm-signup-local?confirmationCode=${standardizedConfirmationCode}&email=${userName}`;

  it('petitioner creates a new account', async () => {
    await cerebralTestPublic.runSequence('goToCreatePetitionerAccountSequence');

    await cerebralTestPublic.runSequence('updateFormValueSequence', {
      key: 'name',
      value: name,
    });

    await cerebralTestPublic.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });

    await cerebralTestPublic.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    await cerebralTestPublic.runSequence('updateFormValueSequence', {
      key: 'confirmPassword',
      value: password,
    });

    await cerebralTestPublic.runSequence(
      'submitCreatePetitionerAccountFormSequence',
    );

    expect(cerebralTestPublic.getState('currentPage')).toEqual(
      'VerificationSent',
    );

    //THIS IS FOR LOCAL VERIFICATION ONLY
    expect(cerebralTestPublic.getState('alertSuccess')).toMatchObject({
      alertType: 'success',
      message: `New user account created successfully for ${userName}! Please click the link below to verify your email address. </br><a rel="noopener noreferrer" href="${expectedVerificationLink}">Verify Email Address</a>`,
      title: 'Account Created Locally',
    });
  });

  it('petitioner follows verification link to confirm new account', async () => {
    await cerebralTestPublic.runSequence('confirmSignUpLocalSequence', {
      confirmationCode: standardizedConfirmationCode,
      userEmail: userName,
    });
    expect(cerebralTestPublic.getState('alertSuccess')).toMatchObject(
      expect.objectContaining({
        alertType: 'success',
        message:
          'Your registration has been confirmed! You will be redirected shortly!',
        title: 'Account Confirmed Locally',
      }),
    );
  });

  it('petitioner logs in successfully', async () => {
    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });
    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    // TODO 10007
    // await cerebralTestPrivate.runSequence('loginWithCognitoLocalSequence', {
    //   code: userName,
    //   password,
    // });

    expect(cerebralTestPrivate.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
    expect(cerebralTestPrivate.getState('alertError')).toBeUndefined();
    expect(cerebralTestPrivate.getState('user.email')).toEqual(userName);
  });

  userSuccessfullyUpdatesEmailAddress(
    cerebralTestPrivate,
    'petitioner',
    updatedEmailAddress,
  );
  userVerifiesUpdatedEmailAddress(cerebralTestPrivate, 'petitioner');

  it('petitioner logs in with new email address', async () => {
    await cerebralTestPrivate.runSequence('signOutSequence');

    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'email',
      value: updatedEmailAddress,
    });
    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    // TODO 10007
    // await cerebralTestPrivate.runSequence('loginWithCognitoLocalSequence', {
    //   code: updatedEmailAddress,
    //   password,
    // });

    expect(cerebralTestPrivate.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
    expect(cerebralTestPrivate.getState('alertError')).toBeUndefined();
    expect(cerebralTestPrivate.getState('user.email')).toEqual(
      updatedEmailAddress,
    );
  });
});
