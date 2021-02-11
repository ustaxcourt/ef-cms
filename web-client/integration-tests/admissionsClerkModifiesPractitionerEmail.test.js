import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { userLogsInAndChecksVerifiedEmailAddress } from './journey/userLogsInAndChecksVerifiedEmailAddress';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';

const test = setupTest();

describe('admissions clerk practitioner journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    test.barNumber = 'SC2222'; //privatePractitioner3

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
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk updates practitioner email', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPractitionerUser');
    expect(test.getState('form.pendingEmail')).toBeUndefined();
    expect(test.getState('form.originalEmail')).toBe(
      'privatePractitioner3@example.com',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: 'alreadyexists@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'alreadyexists@example.com',
    });

    await test.runSequence('submitUpdatePractitionerUserSequence');

    expect(test.getState('validationErrors')).toEqual({
      email:
        'An account with this email already exists. Enter a new email address.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: 'error@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'error@example.com',
    });

    await test.runSequence('submitUpdatePractitionerUserSequence');

    expect(test.getState('modal.showModal')).toBe('EmailVerificationModal');
    expect(test.getState('currentPage')).toEqual('EditPractitionerUser');

    await test.runSequence(
      'closeVerifyEmailModalAndNavigateToPractitionerDetailSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('currentPage')).toEqual('PractitionerDetail');

    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('form.pendingEmail')).toBe('error@example.com');
    expect(test.getState('form.originalEmail')).toBe(
      'privatePractitioner3@example.com',
    );
    expect(test.getState('form.updatedEmail')).toBeUndefined();
    expect(test.getState('form.confirmEmail')).toBeUndefined();
  });

  loginAs(test, 'privatePractitioner3@example.com');
  userVerifiesUpdatedEmailAddress(test, 'practitioner');

  loginAs(test, 'privatePractitioner3@example.com');
  userLogsInAndChecksVerifiedEmailAddress(test, 'practitioner');
});
