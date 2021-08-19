import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, getTextByCount, loginAs, setupTest } from './helpers';

const cerebralTest = setupTest();

describe('Petitions clerk creates Estate case with long additionalName', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('login as a petitions clerk and create a case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: '01',
    });
    const receivedAtYear = '2001';
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: receivedAtYear,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'Some Day',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: 'A Really Large Estate',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Boise, Idaho',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: PARTY_TYPES.estate,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: getTextByCount(500),
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.UNPAID,
    });

    await cerebralTest.runSequence('validatePetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');
  });

  it('Petitions clerk serves paper case', async () => {
    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );
  });
});
