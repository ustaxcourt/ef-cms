import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { faker } from '@faker-js/faker';
import { loginAs, setupTest, waitForLoadingComponentToHide } from './helpers';

// TODO 10007: Need to implement new account creation flow when user is forced to change password.
describe.skip('Admissions clerk creates practitioner account', () => {
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

    await cerebralTest.runSequence('submitLoginSequence', {
      email: emailAddress,
      password: standardizedTemporaryPassword,
    });

    await waitForLoadingComponentToHide({ cerebralTest });

    // expect(cerebralTest.getState('currentPage')).toEqual('ChangePasswordLocal');
  });

  // it('practitioner creates new password', async () => {
  //   await cerebralTest.runSequence('updateFormValueSequence', {
  //     key: 'email',
  //     value: emailAddress,
  //   });

  //   await cerebralTest.runSequence('updateFormValueSequence', {
  //     key: 'newPassword',
  //     value: password,
  //   });

  //   // TODO 10070
  //   await cerebralTest.runSequence('changePasswordLocalSequence');

  //   expect(cerebralTest.getState('currentPage')).toEqual('Login');

  //   expect(cerebralTest.getState('alertSuccess')).toMatchObject({
  //     message: 'Password successfully changed.',
  //   });
  // });

  // it('practitioner logs attempts to log in with invalid password', async () => {
  //   await cerebralTest.runSequence('updateFormValueSequence', {
  //     key: 'email',
  //     value: emailAddress,
  //   });
  //   await cerebralTest.runSequence('updateFormValueSequence', {
  //     key: 'password',
  //     value: 'invalidPassword',
  //   });

  //   // TODO 10007: put new login sequence
  //   // await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
  //   //   code: emailAddress,
  //   //   password: 'invalidPassword',
  //   // });

  //   expect(cerebralTest.getState('currentPage')).toEqual('Login');
  //   expect(cerebralTest.getState('alertError')).toEqual({
  //     message: 'Invalid password',
  //     title: 'Invalid password',
  //   });
  // });

  // it('practitioner logs in successfully with new password', async () => {
  //   await cerebralTest.runSequence('updateFormValueSequence', {
  //     key: 'email',
  //     value: emailAddress,
  //   });
  //   await cerebralTest.runSequence('updateFormValueSequence', {
  //     key: 'password',
  //     value: password,
  //   });

  //   await cerebralTest.runSequence('loginWithCognitoLocalSequence', {
  //     code: emailAddress,
  //     password,
  //   });

  //   expect(cerebralTest.getState('currentPage')).toEqual(
  //     'DashboardPractitioner',
  //   );
  //   expect(cerebralTest.getState('alertError')).toBeUndefined();
  //   expect(cerebralTest.getState('user.email')).toEqual(emailAddress);
  // });
});
