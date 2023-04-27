import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../EntityConstants';
import { CaseExternalInformationFactory } from './CaseExternalInformationFactory';
import { ContactFactory } from '../contacts/ContactFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

const caseExternalErrorMessages =
  CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES;
const contactErrorMessages = ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES;

describe('CaseExternalInformationFactory', () => {
  describe('validation', () => {
    it('should require a wizard step', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {},
        {
          applicationContext,
        },
      );

      expect(caseExternal.getFormattedValidationErrors().wizardStep).toEqual(
        '"wizardStep" is required',
      );
      expect(caseExternal.isValid()).toBeFalsy();
    });
  });

  describe('wizard step 1', () => {
    it('should require a statement of taxpayer identification (STIN) file', () => {
      const caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '1',
        },
        {
          applicationContext,
        },
      );

      expect(caseExternal.getFormattedValidationErrors().stinFile).toEqual(
        caseExternalErrorMessages.stinFile,
      );
    });

    it('should be valid when wizardStep and all step 1 requirements are present', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('wizard step 2', () => {
    it('should require all wizard step 1 and 2 items', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '2',
        },
        {
          applicationContext,
        },
      );

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        petitionFile: caseExternalErrorMessages.petitionFile,
        stinFile: caseExternalErrorMessages.stinFile,
      });
    });

    it('should require hasIrsNotice and petitionFile', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        petitionFile: caseExternalErrorMessages.petitionFile,
      });
    });

    it('should require caseType when hasIrsNotice is present', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: caseExternalErrorMessages.caseType,
      });
    });

    it('should be valid when all step 1 and step 2 params are present', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all step 1 and step 2 params are present, but a partyType and invalid contactPrimary are present', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('wizard step 3', () => {
    it('should require all wizard step 1, 2, and 3 items', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '3',
        },
        {
          applicationContext,
        },
      );

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: caseExternalErrorMessages.filingType,
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        partyType: caseExternalErrorMessages.partyType,
        petitionFile: caseExternalErrorMessages.petitionFile,
        stinFile: caseExternalErrorMessages.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory(
        {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: caseExternalErrorMessages.caseType,
        filingType: caseExternalErrorMessages.filingType,
        partyType: caseExternalErrorMessages.partyType,
      });
    });

    it('should require filingType and partyType when wizard step 1 and 2 required fields are present', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: caseExternalErrorMessages.filingType,
        partyType: caseExternalErrorMessages.partyType,
      });
    });

    it('should require corporateDisclosureFile when filingType is a business', () => {
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
        caseExternal.getFormattedValidationErrors().corporateDisclosureFile,
      ).toEqual(caseExternalErrorMessages.corporateDisclosureFile);
    });

    it('should NOT require corporateDisclosureFile when filingType is NOT a business', () => {
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
        caseExternal.getFormattedValidationErrors().corporateDisclosureFile,
      ).toBeUndefined();
    });

    it('should only require contactPrimary when partyType is Petitioner', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
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

    it('should require contactPrimary and contactSecondary when partyType is Petitioner & Spouse', () => {
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
        caseExternal.getFormattedValidationErrors().petitioners,
      ).toBeDefined();
    });
  });

  describe('wizard step 4', () => {
    it('should require all wizard step 1, 2, 3, and 4 items', () => {
      let caseExternal = new CaseExternalInformationFactory(
        {
          wizardStep: '4',
        },
        {
          applicationContext,
        },
      );

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: caseExternalErrorMessages.filingType,
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        partyType: caseExternalErrorMessages.partyType,
        petitionFile: caseExternalErrorMessages.petitionFile,
        preferredTrialCity: caseExternalErrorMessages.preferredTrialCity,
        procedureType: caseExternalErrorMessages.procedureType,
        stinFile: caseExternalErrorMessages.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory(
        {
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitionerSpouse,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '4',
        },
        {
          applicationContext,
        },
      );

      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: caseExternalErrorMessages.caseType,
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
        preferredTrialCity: caseExternalErrorMessages.preferredTrialCity,
        procedureType: caseExternalErrorMessages.procedureType,
      });
    });

    it('should return no validation errors when all required fields from all steps are present', () => {
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

      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseExternal.isValid()).toBeTruthy();
    });
  });
});
