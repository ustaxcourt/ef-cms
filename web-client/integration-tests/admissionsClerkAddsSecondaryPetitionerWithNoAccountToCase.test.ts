import {
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import {
  callCognitoTriggerForPendingEmail,
  contactSecondaryFromState,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

// TODO 10007: Add as Cypress test
describe.skip('admissions clerk adds secondary petitioner without existing cognito account to case', () => {
  const cerebralTest = setupTest();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('admissions clerk adds secondary petitioner email without existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactSecondary = contactSecondaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactSecondary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(cerebralTest.getState('form.updatedEmail')).toBeUndefined();
    expect(cerebralTest.getState('form.confirmEmail')).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: EMAIL_TO_ADD,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: EMAIL_TO_ADD,
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'NoMatchingEmailFoundModal',
    );
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    await cerebralTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    contactSecondary = contactSecondaryFromState(cerebralTest);

    expect(contactSecondary.email).toBeUndefined();
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    cerebralTest.userId = contactSecondary.contactId;

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(cerebralTest.userId);
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner email is no longer pending and service preference was updated to electronic', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactSecondary = contactSecondaryFromState(cerebralTest);

    expect(contactSecondary.email).toEqual(EMAIL_TO_ADD);
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('admissions clerk verifies new NOCE docket entry on case', () => {
    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const lastDocketEntry = docketEntries.pop();

    expect(lastDocketEntry).toMatchObject({
      documentType: 'Notice of Change of Email Address',
      eventCode: 'NOCE',
    });
    expect(lastDocketEntry.additionalInfo).not.toMatch('for undefined');
  });
});
