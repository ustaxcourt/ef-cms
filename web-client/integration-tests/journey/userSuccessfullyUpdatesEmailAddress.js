import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

export const userSuccessfullyUpdatesEmailAddress = (
  test,
  user,
  mockUpdatedEmail,
) =>
  it(`${user} successfully updates email address`, async () => {
    await test.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: mockUpdatedEmail,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockUpdatedEmail,
    });

    await test.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toEqual('VerifyNewEmailModal');

    await test.runSequence(
      'closeVerifyEmailModalAndNavigateToMyAccountSequence',
      {
        path: '/my-account',
      },
    );

    expect(test.getState('currentPage')).toEqual('MyAccount');

    const header = runCompute(headerHelper, {
      state: test.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeTruthy();
  });
