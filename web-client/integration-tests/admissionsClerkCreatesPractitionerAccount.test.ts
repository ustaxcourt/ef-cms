import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { faker } from '@faker-js/faker';
import { loginAs, setupTest, waitForLoadingComponentToHide } from './helpers';

describe('Admissions clerk creates practitioner account', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const emailAddress = `${faker.internet.userName()}@example.com`;
  const standardizedTemporaryPassword = 'Testing1234$';
  const password = 'Pa$$w0rd!';

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkAddsNewPractitioner(cerebralTest, emailAddress);

  it('practitioner attempts to log in with temporary password', async () => {
    await cerebralTest.runSequence('signOutSequence');
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      email: emailAddress,
    });
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      password: standardizedTemporaryPassword,
    });
    await cerebralTest.runSequence('submitLoginSequence');
    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('currentPage')).toEqual('ChangePassword');
  });

  it('practitioner creates new password', async () => {
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      password,
    });
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      confirmPassword: password,
    });
    await cerebralTest.runSequence('submitChangePasswordSequence');
    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('user')).toBeDefined();
  });

  it('practitioner logs attempts to log in with invalid password', async () => {
    await cerebralTest.runSequence('signOutSequence');

    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      email: emailAddress,
    });
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      password: standardizedTemporaryPassword,
    });

    await cerebralTest.runSequence('submitLoginSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('Login');
    expect(cerebralTest.getState('alertError')).toEqual({
      message: 'The email address or password you entered is invalid.',
      title: 'Please correct the following errors:',
    });
  });

  it('practitioner logs in successfully with new password', async () => {
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      email: emailAddress,
    });
    await cerebralTest.runSequence('updateAuthenticationFormValueSequence', {
      password,
    });

    await cerebralTest.runSequence('submitLoginSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('user')).toBeDefined();
  });
});
