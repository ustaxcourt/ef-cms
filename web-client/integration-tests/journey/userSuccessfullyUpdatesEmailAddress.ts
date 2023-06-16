import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { waitForLoadingComponentToHide } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

export const userSuccessfullyUpdatesEmailAddress = (
  cerebralTest,
  user,
  mockUpdatedEmail,
) =>
  it(`${user} successfully updates email address`, async () => {
    await cerebralTest.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: mockUpdatedEmail,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockUpdatedEmail,
    });

    await cerebralTest.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'VerifyNewEmailModal',
    );

    await cerebralTest.runSequence(
      'closeVerifyEmailModalAndNavigateToMyAccountSequence',
      {
        path: '/my-account',
      },
    );

    expect(cerebralTest.getState('currentPage')).toEqual('MyAccount');

    const header = runCompute(headerHelper, {
      state: cerebralTest.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeTruthy();
  });
