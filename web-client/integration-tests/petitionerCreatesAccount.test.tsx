import { faker } from '@faker-js/faker';
import { setupTest as setupTestPrivate } from './helpers';
import { userSuccessfullyUpdatesEmailAddress } from './journey/userSuccessfullyUpdatesEmailAddress';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';
import React from 'react';

describe('Petitioner creates new account', () => {
  const cerebralTestPrivate = setupTestPrivate();

  afterAll(() => {
    cerebralTestPrivate.closeSocket();
  });

  const userName = `${faker.internet.userName()}@example.com`.toLowerCase();
  const updatedEmailAddress = `${faker.internet.userName()}@example.com`;
  const name = 'Test Petitioner Cognito';
  const password = 'aA1!aaaa';
  let testConfirmationCode;
  let testUserId;

  it('petitioner creates a new account', async () => {
    await cerebralTestPrivate.runSequence(
      'goToCreatePetitionerAccountSequence',
    );

    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'name',
      value: name,
    });

    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });

    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    await cerebralTestPrivate.runSequence('updateFormValueSequence', {
      key: 'confirmPassword',
      value: password,
    });

    const result = await cerebralTestPrivate.runSequence(
      'submitCreatePetitionerAccountFormSequence',
    );

    const { confirmationCode, userId } = result['4'].props;
    testConfirmationCode = confirmationCode;
    testUserId = userId;
    const expectedVerificationLink = `http://localhost:1234/confirm-signup?confirmationCode=${confirmationCode}&email=${userName}&userId=${testUserId}`;
    const expectedMessage = (
      <>
        {' '}
        New user account created successfully for {userName}! Please click the
        link below to verify your email address.
        <br />
        <a href={expectedVerificationLink} rel="noopener noreferrer">
          Verify Email Address
        </a>
      </>
    );

    expect(cerebralTestPrivate.getState('currentPage')).toEqual(
      'VerificationSent',
    );

    //THIS IS FOR LOCAL VERIFICATION ONLY
    expect(cerebralTestPrivate.getState('alertSuccess')).toMatchObject({
      message: expectedMessage,
      title: 'Account Created Locally',
    });
  });

  it('petitioner follows verification link to confirm new account', async () => {
    await cerebralTestPrivate.runSequence('confirmSignUpSequence', {
      confirmationCode: testConfirmationCode,
      email: userName,
      userId: testUserId,
    });
    expect(cerebralTestPrivate.getState('alertSuccess')).toMatchObject(
      expect.objectContaining({
        message:
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      }),
    );
  });

  it('petitioner logs in successfully', async () => {
    await cerebralTestPrivate.runSequence(
      'updateAuthenticationFormValueSequence',
      {
        email: userName,
      },
    );
    await cerebralTestPrivate.runSequence(
      'updateAuthenticationFormValueSequence',
      {
        password,
      },
    );

    await cerebralTestPrivate.runSequence('submitLoginSequence');

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

    await cerebralTestPrivate.runSequence(
      'updateAuthenticationFormValueSequence',
      {
        email: updatedEmailAddress,
      },
    );
    await cerebralTestPrivate.runSequence(
      'updateAuthenticationFormValueSequence',
      {
        password,
      },
    );

    await cerebralTestPrivate.runSequence('submitLoginSequence');

    expect(cerebralTestPrivate.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
    expect(cerebralTestPrivate.getState('alertError')).toBeUndefined();
    expect(cerebralTestPrivate.getState('user.email')).toEqual(
      updatedEmailAddress,
    );
  });
});
