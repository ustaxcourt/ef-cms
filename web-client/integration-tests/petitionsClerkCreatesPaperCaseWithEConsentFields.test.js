import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest } from './helpers';

describe('petitions clerk creates paper case with E-consent fields', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  //create paper case with invalid email
  //submit and see validation errors
  //edit and enter valid email, check e consent box
  //submit
  //verify things on revew screen

  //edit
  //change email add
  //submit
  //review and serve
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('should create a paper case with an invalid email', async () => {
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
      value:
        'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
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
      key: 'stinFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFileSize',
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
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
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
      value: PARTY_TYPES.petitioner,
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

    await cerebralTest.runSequence(
      'updateFormValueAndSecondaryContactInfoSequence',
      {
        key: 'contactPrimary.paperPetitionEmail',
        value: 'invalidEmail',
      },
    );

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'Money, I guess',
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError')).toBeDefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({
      contactPrimary: {
        paperPetitionEmail:
          'Please enter email address in format: yourname@example.com',
      },
    });

    await cerebralTest.runSequence(
      'updateFormValueAndSecondaryContactInfoSequence',
      {
        key: 'contactPrimary.paperPetitionEmail',
        value: 'validEmail@example.com',
      },
    );

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    await cerebralTest.runSequence('gotoCaseDetailSequence');

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
  });

  //go to case detail, parties infor
  //verify paper petition email exists
  it('Refactor my description please!', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
  });

  //verify case from state has e access
  //login as docketlclerk
  //seal address
  //verify things

  //view case as unauthed user, verify the fields dont show
});
