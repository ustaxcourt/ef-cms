import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  PARTY_TYPES,
} from '../EntityConstants';
import { CaseExternalInformationFactory } from './ElectronicPetitionInformationFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

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
        'Upload a Statement of Taxpayer Identification Number (STIN)',
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
          `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
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
        ).toEqual('Your STIN file size is empty');
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
        ).toEqual('Your STIN file size is empty');
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
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        petitionFile: 'Upload a Petition',
        stinFile: 'Upload a Statement of Taxpayer Identification Number (STIN)',
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
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        petitionFile: 'Upload a Petition',
        stinFileSize: 'Your STIN file size is empty',
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
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        petitionFile: 'Upload a Petition',
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
        caseType: 'Select a case type',
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
        filingType: 'Select on whose behalf you are filing',
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        partyType: 'Select a party type',
        petitionFile: 'Upload a Petition',
        stinFile: 'Upload a Statement of Taxpayer Identification Number (STIN)',
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
        caseType: 'Select a case type',
        filingType: 'Select on whose behalf you are filing',
        partyType: 'Select a party type',
        petitionFileSize: 'Your Petition file size is empty',
        stinFileSize: 'Your STIN file size is empty',
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
        filingType: 'Select on whose behalf you are filing',
        partyType: 'Select a party type',
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
      ).toEqual('Upload a Corporate Disclosure Statement');
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
            address1: 'Enter mailing address',
            city: 'Enter city',
            countryType: 'Enter country type',
            index: 0,
            name: 'Enter name',
            phone: 'Enter phone number',
            postalCode: 'Enter ZIP code',
            state: 'Enter state',
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
        filingType: 'Select on whose behalf you are filing',
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        partyType: 'Select a party type',
        petitionFile: 'Upload a Petition',
        preferredTrialCity: 'Select a trial location',
        procedureType: 'Select a case procedure',
        stinFile: 'Upload a Statement of Taxpayer Identification Number (STIN)',
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
        caseType: 'Select a case type',
        petitionFileSize: 'Your Petition file size is empty',
        petitioners: [
          {
            address1: 'Enter mailing address',
            city: 'Enter city',
            countryType: 'Enter country type',
            index: 0,
            name: 'Enter name',
            phone: 'Enter phone number',
            postalCode: 'Enter ZIP code',
            state: 'Enter state',
          },
          {
            address1: 'Enter mailing address',
            city: 'Enter city',
            countryType: 'Enter country type',
            index: 1,
            name: 'Enter name',
            phone: 'Enter phone number',
            postalCode: 'Enter ZIP code',
            state: 'Enter state',
          },
        ],
        preferredTrialCity: 'Select a trial location',
        procedureType: 'Select a case procedure',
        stinFileSize: 'Your STIN file size is empty',
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
