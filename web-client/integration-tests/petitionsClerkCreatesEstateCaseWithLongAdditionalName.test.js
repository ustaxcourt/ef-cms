import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, getTextByCount, loginAs, setupTest } from './helpers';

const test = setupTest();

describe('Petitions clerk creates Estate case with long additionalName', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  it('login as a petitions clerk and create a case', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: '01',
    });
    const receivedAtYear = '2001';
    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: receivedAtYear,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'Some Day',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: 'A Really Large Estate',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Boise, Idaho',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: PARTY_TYPES.estate,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: getTextByCount(500),
    });

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.UNPAID,
    });

    await test.runSequence('validatePetitionFromPaperSequence');
    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');
  });

  it('Petitions clerk serves paper case', async () => {
    await test.runSequence('openConfirmServeToIrsModalSequence');

    await test.runSequence('serveCaseToIrsSequence');

    expect(test.getState('currentPage')).toEqual('PrintPaperPetitionReceipt');
  });
});
