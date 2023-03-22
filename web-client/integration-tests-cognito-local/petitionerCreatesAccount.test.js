import { setupTest } from '../integration-tests/helpers';
const { faker } = require('@faker-js/faker');

describe('Petitioner creates new account', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const userName = `${faker.internet.userName()}@example.com`;
  const name = 'Test Petitioner Cognito';
  const temporaryPassword = 'temporaryPassword';
  const password = 'abc123';

  it('petitioner creates a new account', async () => {
    await cerebralTest.runSequence('signOutSequence');

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
      value: temporaryPassword,
    });

    await cerebralTest.runSequence('createNewAccountLocalSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('LogIn');

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: `New user account created successfully for ${userName}`,
    });
  });

  it('petitioner logs in with old password', async () => {
    // updating form values for consistency
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: temporaryPassword,
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: userName,
      cognitoLocal: temporaryPassword,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('ChangePasswordLocal');
  });

  it('petitioner creates new password', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'newPassword',
      value: password,
    });

    await cerebralTest.runSequence('changePasswordLocalSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('LogIn');

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: 'Password successfully changed.',
    });
  });

  it('petitioner logs attempts to log in with invalid password', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: userName,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: 'invalidPassword',
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: userName,
      cognitoLocal: 'invalidPassword',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('LogIn');
    expect(cerebralTest.getState('alertError')).toEqual({
      title: 'Invalid password',
    });
  });

  it('petitioner logs in successfully with new password', async () => {
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
      cognitoLocal: password,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('user.email')).toEqual(userName);
  });
});
