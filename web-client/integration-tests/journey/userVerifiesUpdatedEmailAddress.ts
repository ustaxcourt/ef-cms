import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { waitForExpectedItem, waitForPage } from '../helpers';

export const userVerifiesUpdatedEmailAddress = (cerebralTest, user: string) =>
  it(`${user} verifies updated email address`, async () => {
    const userFromState = cerebralTest.getState('user');
    const userFromPersistence = await getUserById({
      userId: userFromState.userId,
    });
    const emailVerificationToken =
      userFromPersistence!.pendingEmailVerificationToken;

    await cerebralTest.runSequence('navigateToPathSequence', {
      path: `/verify-email?token=${emailVerificationToken}`,
    });

    const updatedUser = await getUserByIdOnceAllUpdatesComplete({
      userId: userFromState.userId,
    });

    expect(updatedUser.pendingEmailVerificationToken).toBeFalsy();

    await waitForPage({
      cerebralTest,
      expectedPage: 'Login',
    });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'alertSuccess.title',
      expectedItem: 'Email address verified',
    });

    const currentPage = cerebralTest.getState('currentPage');
    const alertSuccess = cerebralTest.getState('alertSuccess');
    expect(currentPage).toEqual('Login');
    expect(alertSuccess).toEqual({
      message: 'Your email address is verified. You can now log in to DAWSON.',
      title: 'Email address verified',
    });
  });
