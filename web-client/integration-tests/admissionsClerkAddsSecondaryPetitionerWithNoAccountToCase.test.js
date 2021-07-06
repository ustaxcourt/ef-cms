import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  callCognitoTriggerForPendingEmail,
  contactSecondaryFromState,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const test = setupTest();

describe('admissions clerk adds secondary petitioner without existing cognito account to case', () => {
  const { COUNTRY_TYPES, PARTY_TYPES, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk adds secondary petitioner email without existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactSecondary = contactSecondaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactSecondary.contactId,
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

    expect(test.getState('modal.showModal')).toBe('NoMatchingEmailFoundModal');
    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.email).toBeUndefined();
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    test.userId = contactSecondary.contactId;

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(test.userId);
  });

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner email is no longer pending and service preference was updated to electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.email).toEqual(EMAIL_TO_ADD);
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
