import { contactPrimaryFromState, refreshElasticsearchIndex } from '../helpers';
import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';

import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

export const userLogsInAndChecksVerifiedEmailAddress = (
  cerebralTest,
  user,
  mockUpdatedEmail,
) =>
  it(`${user} logs in and checks verified email address of ${mockUpdatedEmail}`, async () => {
    const userFromState = cerebralTest.getState('user');

    expect(userFromState.email).toEqual(mockUpdatedEmail);

    const header = runCompute(headerHelper, {
      state: cerebralTest.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeFalsy();

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    if (user === 'petitioner') {
      const contactPrimary = contactPrimaryFromState(cerebralTest);
      const petitionerEmail = contactPrimary.email;

      expect(petitionerEmail).toEqual(mockUpdatedEmail);
    } else {
      const privatePractitioners = cerebralTest.getState(
        'caseDetail.privatePractitioners',
      );
      const privatePractitioner = privatePractitioners.find(
        practitioner => practitioner.userId === userFromState.userId,
      );

      expect(privatePractitioner.email).toEqual(mockUpdatedEmail);
    }
  });
