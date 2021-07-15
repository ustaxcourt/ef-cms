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
import faker from 'faker';

const cerebralTest = setupTest();

describe('admissions clerk practitioner journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    cerebralTest.barNumber = 'SC2222'; //privatePractitioner3

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
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  loginAs(cerebralTest, 'admissionsclerk@example.com');

  it('admissions clerk navigates to edit form', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: cerebralTest.barNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );
  });

  it('admissions clerk updates practitioner email but it already exists', async () => {
    expect(cerebralTest.getState('form.pendingEmail')).toBeUndefined();
    expect(cerebralTest.getState('form.originalEmail')).toBe(
      'privatePractitioner3@example.com',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: 'privatePractitioner99@example.com',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'privatePractitioner99@example.com',
    });

    await cerebralTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      email:
        'An account with this email already exists. Enter a new email address.',
    });
  });

  const validEmail = `${faker.internet.userName()}_no_error@example.com`;
  it('admissions clerk updates practitioner email', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: validEmail,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: validEmail,
    });

    await cerebralTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'EmailVerificationModal',
    );
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );

    await cerebralTest.runSequence(
      'closeVerifyEmailModalAndNavigateToPractitionerDetailSequence',
    );

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
    expect(cerebralTest.getState('currentPage')).toEqual('PractitionerDetail');

    await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: cerebralTest.barNumber,
    });

    expect(cerebralTest.getState('form.pendingEmail')).toBe(validEmail);
    expect(cerebralTest.getState('form.originalEmail')).toBe(
      'privatePractitioner3@example.com',
    );
    expect(cerebralTest.getState('form.updatedEmail')).toBeUndefined();
    expect(cerebralTest.getState('form.confirmEmail')).toBeUndefined();
  });

  describe('private practitioner logs in and verifies email address', () => {
    loginAs(cerebralTest, 'privatePractitioner3@example.com');
    userVerifiesUpdatedEmailAddress(cerebralTest, 'practitioner');

    loginAs(cerebralTest, 'privatePractitioner3@example.com');
    userLogsInAndChecksVerifiedEmailAddress(
      cerebralTest,
      'practitioner',
      validEmail,
    );
  });
});
