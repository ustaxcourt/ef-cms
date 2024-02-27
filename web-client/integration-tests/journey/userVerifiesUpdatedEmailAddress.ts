import { getUserRecordById, wait } from '../helpers';

export const userVerifiesUpdatedEmailAddress = (cerebralTest, user: string) =>
  it(`${user} verifies updated email address`, async () => {
    const userFromState = cerebralTest.getState('user');
    let userFromPersistence = await getUserRecordById(userFromState.userId);
    const emailVerificationToken =
      userFromPersistence.pendingEmailVerificationToken;

    await cerebralTest.runSequence('navigateToPathSequence', {
      path: `/verify-email?token=${emailVerificationToken}`,
    });

    //we need to wait for the async verify-email endpoint to complete.  It can take longer if there are more cases that the petitioner is associated with.  The endpoint doesn't currently (2022-03-22) emit an event when it is done.
    await wait(5000);

    const currentPage = cerebralTest.getState('currentPage');
    const alertSuccess = cerebralTest.getState('alertSuccess');
    expect(currentPage).toEqual('Login');
    expect(alertSuccess).toEqual({
      message: 'Your email address is verified. You can now log in to DAWSON.',
      title: 'Email address verified',
    });
  });
