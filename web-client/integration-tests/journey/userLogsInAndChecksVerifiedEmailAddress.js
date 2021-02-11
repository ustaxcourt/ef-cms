import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

const mockUpdatedEmail = 'error@example.com';
export const userLogsInAndChecksVerifiedEmailAddress = (test, user) =>
  it(`${user} logs in and checks verified email address`, async () => {
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
      const petitionerEmail = test.getState('caseDetail.contactPrimary.email');

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
