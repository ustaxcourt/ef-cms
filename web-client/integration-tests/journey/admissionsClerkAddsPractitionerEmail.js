import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { practitionerDetailHelper } from '../../src/presenter/computeds/practitionerDetailHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import faker from 'faker';

export const admissionsClerkAddsPractitionerEmail = (
  test,
  isGrantingEAccess,
) => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();
  const mockAddress2 = 'A Place';
  const mockAvailableEmail = `${faker.internet.userName()}@example.com`;

  return it('admissions clerk edits practitioner information', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPractitionerUser');

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address2',
      value: mockAddress2,
    });

    await test.runSequence('submitUpdatePractitionerUserSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('practitionerDetail.contact.address2')).toBe(
      mockAddress2,
    );

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPractitionerUser');

    await test.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: mockAvailableEmail,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockAvailableEmail,
    });

    let practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: test.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).not.toBe(
      mockAvailableEmail,
    );

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: mockAvailableEmail,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockAvailableEmail,
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

    expect(practitionerDetailHelperComputed.emailFormatted).toBe(
      mockAvailableEmail,
    );
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

    test.pendingEmail = mockAvailableEmail;

    if (!isGrantingEAccess) {
      expect(foundPractitioner.email).toBe(mockAvailableEmail);
      expect(foundPractitioner.serviceIndicator).toBe(
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      );
    }
  });
};
