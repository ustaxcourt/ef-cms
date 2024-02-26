import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  waitForLoadingComponentToHide,
  waitForModalsToHide,
} from './helpers';
import { internalPetitionPartiesHelper as internalPetitionPartiesHelperComputed } from '../src/presenter/computeds/internalPetitionPartiesHelper';
import { partiesInformationHelper as partiesInformationHelperComputed } from '../src/presenter/computeds/partiesInformationHelper';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('E-Consent journey', () => {
  const cerebralTest = setupTest();

  const validPaperPetitionEmail = 'validEmail@example.com';
  const updatedValidPaperPetitionEmail = 'updated_validEmail@example.com';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('paper filed petitions', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    it('should display validation errors when creating a paper case with an invalid paper petition email', async () => {
      await cerebralTest.runSequence('gotoStartCaseWizardSequence');

      /* eslint-disable sort-keys-fix/sort-keys-fix */
      const paperPetitionFields = {
        caseCaption: 'Margo Albert, Petitioner',
        mailingDate: '12/27/1999',
        preferredTrialCity: 'Seattle, Washington',
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

      await cerebralTest.runSequence(
        'formatAndUpdateDateFromDatePickerSequence',
        {
          key: 'receivedAt',
          toFormat: FORMATS.ISO,
          value: '01/01/2001',
        },
      );

      await cerebralTest.runSequence(
        'formatAndUpdateDateFromDatePickerSequence',
        {
          key: 'petitionPaymentDate',
          toFormat: FORMATS.ISO,
          value: '01/01/2001',
        },
      );

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
            'Enter email address in format: yourname@example.com',
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
      expect(cerebralTest.getState('currentPage')).toEqual(
        'ReviewSavedPetition',
      );

      const { contactPrimary } = cerebralTest.getState('form');
      const reviewSavedPetitionHelper = runCompute(
        withAppContextDecorator(reviewSavedPetitionHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        reviewSavedPetitionHelper.shouldDisplayEConsentTextForPrimaryContact,
      ).toBe(true);
      expect(
        reviewSavedPetitionHelper.eServiceConsentTextForPrimaryContact,
      ).toEqual('No e-service consent');
      expect(contactPrimary.paperPetitionEmail).toEqual(
        validPaperPetitionEmail,
      );

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
      const reviewSavedPetitionHelper = runCompute(
        withAppContextDecorator(reviewSavedPetitionHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        reviewSavedPetitionHelper.shouldDisplayEConsentTextForPrimaryContact,
      ).toBe(true);
      expect(
        reviewSavedPetitionHelper.eServiceConsentTextForPrimaryContact,
      ).toEqual('E-service consent');
      expect(contactPrimary.paperPetitionEmail).toEqual(
        updatedValidPaperPetitionEmail,
      );

      await cerebralTest.runSequence('serveCaseToIrsSequence');

      await waitForLoadingComponentToHide({ cerebralTest });
      await waitForModalsToHide({ cerebralTest, maxWait: 120000 });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'PrintPaperPetitionReceipt',
      );
    });

    it('should display the updated paper petition email on the case information, parties tab after the case has been served', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const partiesInformationHelper = runCompute(
        withAppContextDecorator(partiesInformationHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        partiesInformationHelper.formattedPetitioners[0].paperPetitionEmail,
      ).toEqual(updatedValidPaperPetitionEmail);
    });

    loginAs(cerebralTest, 'petitioner1@example.com');
    it('should not display the paper petition email field for external unassociated users', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const partiesInformationHelper = runCompute(
        withAppContextDecorator(partiesInformationHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        partiesInformationHelper.formattedPetitioners[0].showPaperPetitionEmail,
      ).toBe(false);
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    it('should seal the paper petition email address when petitioner address is sealed but remain viewable to docket clerks', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      let contactPrimary = contactPrimaryFromState(cerebralTest);

      await cerebralTest.runSequence('openSealAddressModalSequence', {
        contactToSeal: contactPrimary,
      });

      await cerebralTest.runSequence('sealAddressSequence');

      const partiesInformationHelper = runCompute(
        withAppContextDecorator(partiesInformationHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        partiesInformationHelper.formattedPetitioners[0].isAddressSealed,
      ).toBe(true);
      expect(
        partiesInformationHelper.formattedPetitioners[0].sealedAndUnavailable,
      ).toBe(false);
      expect(
        partiesInformationHelper.formattedPetitioners[0].showPaperPetitionEmail,
      ).toBe(true);
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    it('should not display the paper petition email field for internal users other than docket clerk when the petitioner address is sealed', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const partiesInformationHelper = runCompute(
        withAppContextDecorator(partiesInformationHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        partiesInformationHelper.formattedPetitioners[0].isAddressSealed,
      ).toBe(true);
      expect(
        partiesInformationHelper.formattedPetitioners[0].sealedAndUnavailable,
      ).toBe(true);
      expect(
        partiesInformationHelper.formattedPetitioners[0].showPaperPetitionEmail,
      ).toBe(false);
    });
  });

  describe('electronically filed petitions', () => {
    it('petitioner e-files a case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);

      expect(caseDetail.docketNumber).toBeDefined();

      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    it('petitions clerk qcs the electronically filed petition and does NOT see e-consent fields', async () => {
      await cerebralTest.runSequence('gotoPetitionQcSequence', {
        docketNumber: cerebralTest.docketNumber,
        tab: 'partyInfo',
      });

      const internalPetitionPartiesHelper = runCompute(
        withAppContextDecorator(internalPetitionPartiesHelperComputed),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(
        internalPetitionPartiesHelper.showPaperPetitionEmailFieldAndConsentBox,
      ).toBe(false);
    });
  });
});
