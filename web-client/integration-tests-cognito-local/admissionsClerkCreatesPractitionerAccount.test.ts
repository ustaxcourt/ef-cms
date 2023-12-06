import { admissionsClerkAddsNewPractitioner } from '../integration-tests/journey/admissionsClerkAddsNewPractitioner';
import {
  loginAs,
  setupTest,
  waitForLoadingComponentToHide,
} from '../integration-tests/helpers';

const { faker } = require('@faker-js/faker');

describe('Admissions clerk creates practitioner account', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const emailAddress = `${faker.internet.userName()}@example.com`;
  const standardizedTemporaryPassword = '123456';
  const password = 'Pa$$word!';

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkAddsNewPractitioner(cerebralTest, emailAddress);

  it('practitioner attempts to log in with temporary password', async () => {
    await cerebralTest.runSequence('signOutSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: emailAddress,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: standardizedTemporaryPassword,
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: emailAddress,
      password: standardizedTemporaryPassword,
    });

    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('currentPage')).toEqual('ChangePasswordLocal');
  });

  it('practitioner creates new password', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: emailAddress,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'newPassword',
      value: password,
    });

    await cerebralTest.runSequence('changePasswordLocalSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('LogIn');

    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Password successfully changed.',
    });
  });

  it('practitioner logs attempts to log in with invalid password', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: emailAddress,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: 'invalidPassword',
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: emailAddress,
      password: 'invalidPassword',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('LogIn');
    expect(cerebralTest.getState('alertError')).toEqual({
      message: 'Invalid password',
      title: 'Invalid password',
    });
  });

  it('practitioner logs in successfully with new password', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: emailAddress,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'password',
      value: password,
    });

    await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
      code: emailAddress,
      password,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('user.email')).toEqual(emailAddress);
  });
});
