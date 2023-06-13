import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
} from '../EntityConstants';
import { CaseExternalInformationFactory } from './CaseExternalInformationFactory';
import { ContactFactory } from '../contacts/ContactFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

const contactErrorMessages = ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES;

describe('CaseExternalInformationFactory entity', () => {
  it('requires wizard step', () => {
    const caseExternal = new CaseExternalInformationFactory(
      {},
      {
        applicationContext,
      },
    );
    expect(caseExternal.getFormattedValidationErrors()!!.wizardStep).toEqual(
      '"wizardStep" is required',
    );
    expect(caseExternal.isValid()).toBeFalsy();
  });

  describe('wizard step 1', () => {
    it('requires stinFile', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '1',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!.stinFile).toEqual(
        CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.stinFile,
      );
    });

    it('should be valid if all step 1 and step 2 params are present', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '1',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual(null);
    });

    describe('STIN file size', () => {
      it('should inform you if stin file size is greater than the PDF max file size', () => {
        const caseExternal = new CaseExternalInformationFactory(
          {
            stinFile: new File([], 'test.pdf'),
            stinFileSize: MAX_FILE_SIZE_BYTES + 5,
            wizardStep: '1',
          },
          {
            applicationContext,
          },
        );
        expect(
          caseExternal.getFormattedValidationErrors()!.stinFileSize,
        ).toEqual(
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .stinFileSize[0].message,
        );
      });

      it('should inform you if stin file size is zero', () => {
        const caseExternal = new CaseExternalInformationFactory(
          {
            stinFile: new File([], 'test.pdf'),
            stinFileSize: 0,
            wizardStep: '1',
          },
          {
            applicationContext,
          },
        );
        expect(
          caseExternal.getFormattedValidationErrors()!.stinFileSize,
        ).toEqual(
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .stinFileSize[1],
        );
      });

      it('should not error on stinFileSize when stinFile is undefined', () => {
        const caseExternal = new CaseExternalInformationFactory(
          {
            wizardStep: '1',
          },
          {
            applicationContext,
          },
        );
        expect(
          caseExternal.getFormattedValidationErrors()!.stinFileSize,
        ).toBeUndefined();
      });

      it('should error on stinFileSize when stinFile is defined', () => {
        const caseExternal = new CaseExternalInformationFactory(
          {
            stinFile: new File([], 'testStinFile.pdf'),
            wizardStep: '1',
          },
          {
            applicationContext,
          },
        );
        expect(
          caseExternal.getFormattedValidationErrors()!.stinFileSize,
        ).toEqual(
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .stinFileSize[1],
        );
      });
    });
  });

  describe('wizard step 2', () => {
    it('requires all wizard step 1 and 2 items', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        hasIrsNotice:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.hasIrsNotice,
        petitionFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.petitionFile,
        stinFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory(
        {
          stinFile: new File([], 'test.pdf'),
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        hasIrsNotice:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.hasIrsNotice,
        petitionFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.petitionFile,
        stinFileSize:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .stinFileSize[1],
      });
    });

    it('requires hasIrsNotice and petitionFile if no params from step 2 are present', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        hasIrsNotice:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.hasIrsNotice,
        petitionFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.petitionFile,
      });
    });

    it('requires caseType if hasIrsNotice is present', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          hasIrsNotice: true,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        caseType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.caseType,
      });
    });

    it('should be valid if all step 1 and step 2 params are present', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          hasIrsNotice: true,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual(null);
    });

    it('should be valid if all step 1 and step 2 params are present, but a partyType and invalid contactPrimary are present', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          petitioners: [
            {
              name: 'Something',
            },
          ],
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual(null);
    });
  });

  describe('wizard step 3', () => {
    it('requires all wizard step 1, 2, and 3 items', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        filingType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.filingType,
        hasIrsNotice:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.hasIrsNotice,
        partyType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.partyType,
        petitionFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.petitionFile,
        stinFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory(
        {
          hasIrsNotice: true,
          petitionFile: new File([], 'test.pdf'),
          stinFile: new File([], 'test.pdf'),
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        caseType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.caseType,
        filingType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.filingType,
        partyType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.partyType,
        petitionFileSize:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .petitionFileSize[1],
        stinFileSize:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .stinFileSize[1],
      });
    });

    it('requires filingType and partyType if wizard step 1 and 2 required fields are present', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          hasIrsNotice: true,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        filingType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.filingType,
        partyType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.partyType,
      });
    });

    it('requires corporateDisclosureFile if filingType is A business', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          filingType: 'A business',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.corporation,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual(
        CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
          .corporateDisclosureFile,
      );
    });

    it('does not require corporateDisclosureFile if filingType is not A business', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          filingType: 'something else',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.corporation,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toBeUndefined();
    });

    it('requires only contactPrimary if partyType is Petitioner', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        petitioners: [
          {
            address1: contactErrorMessages.address1,
            city: contactErrorMessages.city,
            countryType: contactErrorMessages.countryType,
            index: 0,
            name: contactErrorMessages.name,
            phone: contactErrorMessages.phone,
            postalCode: contactErrorMessages.postalCode[1],
            state: contactErrorMessages.state,
          },
        ],
      });
    });

    it('requires contactPrimary and contactSecondary if partyType is Petitioner & Spouse', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.petitioners,
      ).toBeDefined();
    });
  });

  describe('wizard step 4', () => {
    it('requires all wizard step 1, 2, 3, and 4 items', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '4',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        filingType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.filingType,
        hasIrsNotice:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.hasIrsNotice,
        partyType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.partyType,
        petitionFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.petitionFile,
        preferredTrialCity:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .preferredTrialCity,
        procedureType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .procedureType,
        stinFile:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory(
        {
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitionFile: new File([], 'test.pdf'),
          stinFile: new File([], 'test.pdf'),
          wizardStep: '4',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual({
        caseType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES.caseType,
        petitionFileSize:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .petitionFileSize[1],
        petitioners: [
          {
            address1: contactErrorMessages.address1,
            city: contactErrorMessages.city,
            countryType: contactErrorMessages.countryType,
            index: 0,
            name: contactErrorMessages.name,
            phone: contactErrorMessages.phone,
            postalCode: contactErrorMessages.postalCode[1],
            state: contactErrorMessages.state,
          },
          {
            address1: contactErrorMessages.address1,
            city: contactErrorMessages.city,
            countryType: contactErrorMessages.countryType,
            index: 1,
            name: contactErrorMessages.name,
            phone: contactErrorMessages.phone,
            postalCode: contactErrorMessages.postalCode[1],
            state: contactErrorMessages.state,
          },
        ],
        preferredTrialCity:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .preferredTrialCity,
        procedureType:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .procedureType,
        stinFileSize:
          CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES
            .stinFileSize[1],
      });
    });

    it('returns no validation errors if all required fields from all steps are present', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          caseType: CASE_TYPES_MAP.deficiency,
          contactSecondary: {
            address1: '123 Main St',
            city: 'Somewhere',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Test Secondary',
            phone: '1234567890',
            postalCode: '12345',
            state: 'CA',
          },
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          petitioners: [
            {
              address1: '123 Main St',
              city: 'Somewhere',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              name: 'Test Primary',
              phone: '1234567890',
              postalCode: '12345',
              state: 'CA',
            },
          ],
          preferredTrialCity: 'Boise, Idaho',
          procedureType: 'Regular',
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '4',
        },
        {
          applicationContext,
        },
      );
      expect(caseExternal.getFormattedValidationErrors()!).toEqual(null);
      expect(caseExternal.isValid()).toBeTruthy();
    });
  });
});
