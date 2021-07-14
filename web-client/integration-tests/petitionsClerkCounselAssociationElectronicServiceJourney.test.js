import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  callCognitoTriggerForPendingEmail,
  contactPrimaryFromState,
  contactSecondaryFromState,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const test = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

describe('Petitions Clerk Counsel Association Journey', () => {
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
        name: 'Test Petitioner 2',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
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
  it('admissions clerk adds secondary petitioner email with existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactSecondary = contactSecondaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactSecondary.contactId,
      docketNumber: test.docketNumber,
    });

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(test.getState('form.updatedEmail')).toBeUndefined();
    expect(test.getState('form.confirmEmail')).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner2@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner2@example.com',
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

    contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.email).toEqual('petitioner2@example.com');
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(test, 'petitionsclerk@example.com');

  it('Petitions clerk manually adds a privatePractitioner to case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const practitionerBarNumber = 'PT1234';

    expect(test.getState('caseDetail.privatePractitioners')).toEqual([]);

    await test.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await test.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(test.getState('modal.practitionerMatches.length')).toEqual(1);

    let practitionerMatch = test.getState('modal.practitionerMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    const contactPrimary = contactPrimaryFromState(test);
    const contactSecondary = contactSecondaryFromState(test);
    await test.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });
    await test.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: true,
    });

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await test.runSequence('associatePrivatePractitionerWithCaseSequence');

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(1);
    expect(
      test.getState('caseDetail.privatePractitioners.0.representing'),
    ).toEqual([contactPrimary.contactId, contactSecondary.contactId]);
    expect(test.getState('caseDetail.privatePractitioners.0.name')).toEqual(
      practitionerMatch.name,
    );

    let formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(1);
    expect(formatted.privatePractitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(test, 'admissionsclerk@example.com');
  it('Admissions Clerk updates petitioner email address', async () => {
    const NEW_EMAIL = `new${Math.random()}@example.com`;

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);
    test.contactPrimaryId = contactPrimary.contactId;

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: NEW_EMAIL,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: NEW_EMAIL,
    });

    await test.runSequence('submitEditPetitionerSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('alertSuccess.message')).toEqual('Changes saved.');

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(test.contactPrimaryId);
  });

  it('admissions clerk verifies petitioner service preference was not updated', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it('Petitions clerk removes a practitioner from a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(1);

    const barNumber = test.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await test.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('EditPetitionerCounsel');

    await test.runSequence('openRemovePetitionerCounselModalSequence');

    expect(test.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await test.runSequence('removePetitionerCounselFromCaseSequence');

    await refreshElasticsearchIndex();

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(0);
  });

  it('verifies the service indicator for the second petitioner reverts to electronic', async () => {
    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
