import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('admissions clerk adds petitioner with existing cognito account to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = 'petitioner2@example.com';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk adds petitioner email with existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(test.getState('form.updatedEmail')).toBeUndefined();
    expect(test.getState('form.confirmEmail')).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toBe('MatchingEmailFoundModal');
    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.email).toEqual(EMAIL_TO_ADD);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(test, 'petitioner2@example.com');
  it('petitioner with existing account verifies case is added to dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
    const openCases = test.getState('openCases');

    const addedCase = openCases.find(c => c.docketNumber === test.docketNumber);
    expect(addedCase).toBeDefined();

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('screenMetadata.isAssociated')).toEqual(true);
  });

  it('should verify that practitioner representing contactId matches contactPrimary contactId after email is updated', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);

    const practitionerRepresenting = test.getState(
      'caseDetail.privatePractitioners.0.representing',
    );

    expect(practitionerRepresenting).toEqual([contactPrimary.contactId]);
  });
});
