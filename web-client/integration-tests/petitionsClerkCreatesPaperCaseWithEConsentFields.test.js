import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest } from './helpers';
import { partiesInformationHelper } from '../src/presenter/computeds/partiesInformationHelper';
import { reviewSavedPetitionHelper } from '../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('petitions clerk creates paper case with E-consent fields', () => {
  const cerebralTest = setupTest();

  const validPaperPetitionEmail = 'validEmail@example.com';
  const updatedValidPaperPetitionEmail = 'updated_validEmail@example.com';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('should display validation errors when creating a paper case with an invalid paper petition email', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    /* eslint-disable sort-keys-fix/sort-keys-fix */
    const paperPetitionFields = {
      caseCaption: 'Margo Albert, Petitioner',
      mailingDate: '12/27/1999',
      preferredTrialCity: 'Seattle, Washington',
      receivedAtDay: '01',
      receivedAtMonth: '01',
      receivedAtYear: '2001',
      procedureType: 'Small',
      caseType: CASE_TYPES_MAP.whistleblower,
      partyType: PARTY_TYPES.petitioner,
      ['contactPrimary.countryType']: COUNTRY_TYPES.DOMESTIC,
      ['contactPrimary.name']: 'Margo Albert',
      ['contactPrimary.address1']: '1234 N Road Lane',
      ['contactPrimary.city']: 'Cityville',
      ['contactPrimary.state']: 'WA',
      ['contactPrimary.postalCode']: '45755',
      ['contactPrimary.phone']: '231-845-2215',
      paymentDateDay: '01',
      paymentDateMonth: '01',
      paymentDateYear: '2001',
      petitionFile: fakeFile,
      petitionFileSize: 5,
      stinFile: fakeFile,
      stinFileSize: 2,
      requestForPlaceOfTrialFile: fakeFile,
      requestForPlaceOfTrialFileSize: 3,
    };

    for (const [key, value] of Object.entries(paperPetitionFields)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'Check',
    });

    await cerebralTest.runSequence(
      'updateFormValueAndSecondaryContactInfoSequence',
      {
        key: 'contactPrimary.paperPetitionEmail',
        value: 'invalidEmail',
      },
    );

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
        value: validPaperPetitionEmail,
      },
    );

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const { contactPrimary } = cerebralTest.getState('form');
    const reviewSavedPetitionHelperComputed = runCompute(
      withAppContextDecorator(reviewSavedPetitionHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      reviewSavedPetitionHelperComputed.shouldDisplayEConsentTextForPrimaryContact,
    ).toBe(true);
    expect(
      reviewSavedPetitionHelperComputed.eServiceConsentTextForPrimaryContact,
    ).toEqual('No e-service consent');
    expect(contactPrimary.paperPetitionEmail).toEqual(validPaperPetitionEmail);

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
  });

  it('should allow edits to paper petition email and electronic consent values and display those updates on the Review Petition screen', async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      tab: 'partyInfo',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    await cerebralTest.runSequence('updateFormValueAndCaseCaptionSequence', {
      key: 'contactPrimary.paperPetitionEmail',
      value: updatedValidPaperPetitionEmail,
    });

    await cerebralTest.runSequence('updateFormValueAndCaseCaptionSequence', {
      key: 'contactPrimary.hasConsentedToEService',
      value: true,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 2,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 5,
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const { contactPrimary } = cerebralTest.getState('form');
    const reviewSavedPetitionHelperComputed = runCompute(
      withAppContextDecorator(reviewSavedPetitionHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      reviewSavedPetitionHelperComputed.shouldDisplayEConsentTextForPrimaryContact,
    ).toBe(true);
    expect(
      reviewSavedPetitionHelperComputed.eServiceConsentTextForPrimaryContact,
    ).toEqual('E-service consent');
    expect(contactPrimary.paperPetitionEmail).toEqual(
      updatedValidPaperPetitionEmail,
    );

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );
  });

  it('should display the updated paper petition email on the case information, parties tab after the case has been served', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const partiesInformationHelperComputed = runCompute(
      withAppContextDecorator(partiesInformationHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      partiesInformationHelperComputed.formattedPetitioners[0]
        .paperPetitionEmail,
    ).toEqual(updatedValidPaperPetitionEmail);
  });

  // loginAs(cerebralTest, 'docketclerk@example.com');
  // it('should still display paper petition email after docket clerk seals the petitioners address', async () => {
  //   await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //     docketNumber: cerebralTest.docketNumber,
  //   });

  //   const { petitioners } = cerebralTest.getState('caseDetail');

  //   await cerebralTest.runSequence('openSealAddressModalSequence', {
  //     contactToSeal: petitioners[0],
  //   });

  //   await cerebralTest.runSequence('sealAddressSequence');
  // });

  //view case as unauthed user, verify the fields dont show
});
