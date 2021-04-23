import { contactPrimaryFromState, refreshElasticsearchIndex } from '../helpers';
import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';

import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

export const userLogsInAndChecksVerifiedEmailAddress = (
  test,
  user,
  mockUpdatedEmail,
) =>
  it(`${user} logs in and checks verified email address of ${mockUpdatedEmail}`, async () => {
    const userFromState = test.getState('user');

    expect(userFromState.email).toEqual(mockUpdatedEmail);

    const header = runCompute(headerHelper, {
      state: test.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeFalsy();

    await refreshElasticsearchIndex();

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    if (user === 'petitioner') {
      const contactPrimary = contactPrimaryFromState(test);
      const petitionerEmail = contactPrimary.email;

      expect(petitionerEmail).toEqual(mockUpdatedEmail);
    } else {
      const privatePractitioners = test.getState(
        'caseDetail.privatePractitioners',
      );
      const privatePractitioner = privatePractitioners.find(
        practitioner => practitioner.userId === userFromState.userId,
      );

      expect(privatePractitioner.email).toEqual(mockUpdatedEmail);
    }
  });
