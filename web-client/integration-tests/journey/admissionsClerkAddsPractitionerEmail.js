import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { practitionerDetailHelper } from '../../src/presenter/computeds/practitionerDetailHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const admissionsClerkAddsPractitionerEmail = test => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();
  const mockEmail = 'test@example.com';

  return it('admissions clerk edits practitioner information', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPractitionerUser');

    await test.runSequence('submitUpdatePractitionerUserSequence');

    expect(test.getState('validationErrors')).toEqual({
      email: 'Enter email address',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: mockEmail,
    });

    let practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: test.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).not.toBe(mockEmail);

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: mockEmail,
    });

    test.setState('practitionerDetail', {});

    await test.runSequence('submitUpdatePractitionerUserSequence');

    await refreshElasticsearchIndex();

    expect(test.getState('validationErrors')).toEqual({});

    practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: test.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).toBe(mockEmail);
    expect(practitionerDetailHelperComputed.serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();

    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const foundPractitioner = test
      .getState('caseDetail.privatePractitioners')
      .find(x => x.barNumber === test.barNumber);

    expect(foundPractitioner.email).toBe(mockEmail);
    expect(foundPractitioner.serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
};
