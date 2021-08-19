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

const cerebralTest = setupTest();
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
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('admissions clerk adds secondary petitioner email with existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactSecondary = contactSecondaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactSecondary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(cerebralTest.getState('form.updatedEmail')).toBeUndefined();
    expect(cerebralTest.getState('form.confirmEmail')).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner2@example.com',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner2@example.com',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'MatchingEmailFoundModal',
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

    expect(contactSecondary.email).toEqual('petitioner2@example.com');
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('Petitions clerk manually adds a privatePractitioner to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const practitionerBarNumber = 'PT1234';

    expect(cerebralTest.getState('caseDetail.privatePractitioners')).toEqual(
      [],
    );

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(cerebralTest.getState('modal.practitionerMatches.length')).toEqual(
      1,
    );

    let practitionerMatch = cerebralTest.getState(
      'modal.practitionerMatches.0',
    );
    expect(cerebralTest.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    const contactSecondary = contactSecondaryFromState(cerebralTest);
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: true,
    });

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await cerebralTest.runSequence(
      'associatePrivatePractitionerWithCaseSequence',
    );

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(1);
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.representing'),
    ).toEqual([contactPrimary.contactId, contactSecondary.contactId]);
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.name'),
    ).toEqual(practitionerMatch.name);

    let formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(1);
    expect(formatted.privatePractitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('Admissions Clerk updates petitioner email address', async () => {
    const NEW_EMAIL = `new${Math.random()}@example.com`;

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    cerebralTest.contactPrimaryId = contactPrimary.contactId;

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: NEW_EMAIL,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: NEW_EMAIL,
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(cerebralTest.contactPrimaryId);
  });

  it('admissions clerk verifies petitioner service preference was not updated', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it('Petitions clerk removes a practitioner from a case', async () => {
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(1);

    const barNumber = cerebralTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await cerebralTest.runSequence('openRemovePetitionerCounselModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await cerebralTest.runSequence('removePetitionerCounselFromCaseSequence');

    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(0);
  });

  it('verifies the service indicator for the second petitioner reverts to electronic', () => {
    const contactSecondary = contactSecondaryFromState(cerebralTest);

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
