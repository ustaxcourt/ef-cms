import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { practitionerDetailHelper } from '../../src/presenter/computeds/practitionerDetailHelper';
import {
  refreshElasticsearchIndex,
  waitForLoadingComponentToHide,
} from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';
const { faker } = require('@faker-js/faker');

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

    await waitForLoadingComponentToHide({ cerebralTest });

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

    await waitForLoadingComponentToHide({ cerebralTest });

    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence(
      'closeVerifyEmailModalAndNavigateToPractitionerDetailSequence',
    );

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
