import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  contactSecondaryFromState,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
// import { docketClerkAddsPetitionerToCase } from './journey/docketClerkAddsPetitionerToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const test = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { getContactSecondary } from '../../shared/src/business/entities/cases/Case';
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
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  // loginAs(test, 'docketclerk@example.com');
  // docketClerkAddsPetitionerToCase(test, { name: 'Test Petitioner 2' });

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

    //default selected because there was only 1 match
    let practitionerMatch = test.getState('modal.practitionerMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'representingPrimary',
      value: true,
    });
    await test.runSequence('updateModalValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await test.runSequence('associatePrivatePractitionerWithCaseSequence');

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(1);
    const contactPrimary = contactPrimaryFromState(test);
    const contactSecondary = contactSecondaryFromState(test);

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

  it('Petitions clerk removes a practitioner from a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(1);

    await test.runSequence('openEditPrivatePractitionersModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.0.removeFromCase',
      value: true,
    });

    await test.runSequence('submitEditPrivatePractitionersModalSequence');

    await refreshElasticsearchIndex();

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(0);
  });

  it('verifies the  service indicator for the second petitioner reverts to electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const contactSecondary = getContactSecondary(formattedCase);

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
