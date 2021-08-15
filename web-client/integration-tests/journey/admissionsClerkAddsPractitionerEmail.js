import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { practitionerDetailHelper } from '../../src/presenter/computeds/practitionerDetailHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import faker from 'faker';

export const admissionsClerkAddsPractitionerEmail = cerebralTest => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();
  const mockAddress2 = 'A Place';
  const mockAvailableEmail = `${faker.internet.userName()}@example.com`;

  return it('admissions clerk edits practitioner information', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: cerebralTest.barNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address2',
      value: mockAddress2,
    });

    await cerebralTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('practitionerDetail.contact.address2')).toBe(
      mockAddress2,
    );

    await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: cerebralTest.barNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: mockAvailableEmail,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockAvailableEmail,
    });

    let practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).not.toBe(
      mockAvailableEmail,
    );

    await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: cerebralTest.barNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: mockAvailableEmail,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockAvailableEmail,
    });

    cerebralTest.setState('practitionerDetail', {});

    await cerebralTest.runSequence('submitUpdatePractitionerUserSequence');

    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).toBeUndefined();

    expect(practitionerDetailHelperComputed.pendingEmailFormatted).toBe(
      `${mockAvailableEmail} (Pending)`,
    );
    expect(practitionerDetailHelperComputed.serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    await refreshElasticsearchIndex();

    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    cerebralTest.pendingEmail = mockAvailableEmail;
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });
};
