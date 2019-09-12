const {
  CaseExternalInformationFactory,
} = require('./CaseExternalInformationFactory');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');

describe('CaseExternalInformationFactory entity', () => {
  it('requires wizard step', () => {
    const caseExternal = new CaseExternalInformationFactory({});
    expect(caseExternal.getFormattedValidationErrors().wizardStep).toEqual(
      '"wizardStep" is required',
    );
    expect(caseExternal.isValid()).toBeFalsy();
  });

  describe('wizard step 1', () => {
    it('requires stinFile', () => {
      const caseExternal = new CaseExternalInformationFactory({
        wizardStep: '1',
      });
      expect(caseExternal.getFormattedValidationErrors().stinFile).toEqual(
        'Upload a statement of taxpayer identification',
      );
    });

    it('should be valid if all step 1 and step 2 params are present', () => {
      const caseExternal = new CaseExternalInformationFactory({
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '1',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });

    describe('STIN file size', () => {
      it('should inform you if stin file size is greater than 500MB', () => {
        const caseExternal = new CaseExternalInformationFactory({
          stinFile: new File([], 'test.pdf'),
          stinFileSize: MAX_FILE_SIZE_BYTES + 5,
          wizardStep: '1',
        });
        expect(
          caseExternal.getFormattedValidationErrors().stinFileSize,
        ).toEqual(
          `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        );
      });

      it('should inform you if stin file size is zero', () => {
        const caseExternal = new CaseExternalInformationFactory({
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 0,
          wizardStep: '1',
        });
        expect(
          caseExternal.getFormattedValidationErrors().stinFileSize,
        ).toEqual('Your STIN file size is empty');
      });

      it('should not error on stinFileSize when stinFile is undefined', () => {
        const caseExternal = new CaseExternalInformationFactory({
          wizardStep: '1',
        });
        expect(
          caseExternal.getFormattedValidationErrors().stinFileSize,
        ).toBeUndefined();
      });

      it('should error on stinFileSize when stinFile is defined', () => {
        const caseExternal = new CaseExternalInformationFactory({
          stinFile: new File([], 'testStinFile.pdf'),
          wizardStep: '1',
        });
        expect(
          caseExternal.getFormattedValidationErrors().stinFileSize,
        ).toEqual('Your STIN file size is empty');
      });
    });
  });

  describe('wizard step 2', () => {
    it('requires all wizard step 1 and 2 items', () => {
      let caseExternal = new CaseExternalInformationFactory({
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        petitionFile: 'Upload a Petition',
        stinFile: 'Upload a statement of taxpayer identification',
      });

      caseExternal = new CaseExternalInformationFactory({
        stinFile: new File([], 'test.pdf'),
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        petitionFile: 'Upload a Petition',
        stinFileSize: 'Your STIN file size is empty',
      });
    });

    it('requires hasIrsNotice and petitionFile if no params from step 2 are present', () => {
      const caseExternal = new CaseExternalInformationFactory({
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        petitionFile: 'Upload a Petition',
      });
    });

    it('requires caseType if hasIrsNotice is present', () => {
      const caseExternal = new CaseExternalInformationFactory({
        hasIrsNotice: true,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: 'Select a case type',
      });
    });

    it('should be valid if all step 1 and step 2 params are present', () => {
      const caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        hasIrsNotice: true,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid if all step 1 and step 2 params are present, but a partyType and invalid contactPrimary are present', () => {
      const caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        contactPrimary: {
          name: 'Something',
        },
        hasIrsNotice: true,
        partyType: 'Myself',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });

    describe('petition file size', () => {
      it('should inform you if petition file size is greater than 500MB', () => {
        const caseExternal = new CaseExternalInformationFactory({
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: MAX_FILE_SIZE_BYTES + 5,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        });
        expect(
          caseExternal.getFormattedValidationErrors().petitionFileSize,
        ).toEqual(
          `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        );
      });

      it('should inform you if petition file size is zero', () => {
        const caseExternal = new CaseExternalInformationFactory({
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 0,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        });
        expect(
          caseExternal.getFormattedValidationErrors().petitionFileSize,
        ).toEqual('Your Petition file size is empty');
      });

      it('should not error on petitionFileSize when petitionFile is undefined', () => {
        const caseExternal = new CaseExternalInformationFactory({
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        });
        expect(
          caseExternal.getFormattedValidationErrors().petitionFileSize,
        ).toBeUndefined();
      });

      it('should error on petitionFileSize when petitionFile is defined', () => {
        const caseExternal = new CaseExternalInformationFactory({
          petitionFile: new File([], 'test.pdf'),
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        });
        expect(
          caseExternal.getFormattedValidationErrors().petitionFileSize,
        ).toEqual('Your Petition file size is empty');
      });
    });
  });

  describe('wizard step 3', () => {
    it('requires all wizard step 1, 2, and 3 items', () => {
      let caseExternal = new CaseExternalInformationFactory({
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: 'Filing Type is required',
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        partyType: 'Select a party type',
        petitionFile: 'Upload a Petition',
        stinFile: 'Upload a statement of taxpayer identification',
      });

      caseExternal = new CaseExternalInformationFactory({
        hasIrsNotice: true,
        petitionFile: new File([], 'test.pdf'),
        stinFile: new File([], 'test.pdf'),
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: 'Select a case type',
        filingType: 'Filing Type is required',
        partyType: 'Select a party type',
        petitionFileSize: 'Your Petition file size is empty',
        stinFileSize: 'Your STIN file size is empty',
      });
    });

    it('requires filingType and partyType if wizard step 1 and 2 required fields are present', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        hasIrsNotice: true,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: 'Filing Type is required',
        partyType: 'Select a party type',
      });
    });

    it('requires ownershipDisclosureFile if filingType is A business', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'A business',
        hasIrsNotice: true,
        partyType: 'Corporation',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual('Upload an Ownership Disclosure Statement');
    });

    it('does not require ownershipDisclosureFile if filingType is not A business', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'something else',
        hasIrsNotice: true,
        partyType: 'Corporation',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });

    it('requires only contactPrimary if partyType is Petitioner', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: 'Petitioner',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        contactPrimary: {
          address1: 'Address is a required field.',
          city: 'City is a required field.',
          countryType: 'Country Type is a required field.',
          name: 'Name is a required field.',
          phone: 'Phone is a required field.',
          postalCode: 'Zip Code is a required field.',
          state: 'State is a required field.',
        },
      });
    });

    it('requires contactPrimary and contactSecondary if partyType is Petitioner & Spouse', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: 'Petitioner & Spouse',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(
        caseExternal.getFormattedValidationErrors().contactPrimary,
      ).toBeDefined();
      expect(
        caseExternal.getFormattedValidationErrors().contactSecondary,
      ).toBeDefined();
    });

    describe('ownership disclosure file size', () => {
      it('should inform you if ownership disclosure file size is greater than 500MB', () => {
        const caseExternal = new CaseExternalInformationFactory({
          ownershipDisclosureFile: new File([], 'test.pdf'),
          ownershipDisclosureFileSize: MAX_FILE_SIZE_BYTES + 5,
          wizardStep: '3',
        });
        expect(
          caseExternal.getFormattedValidationErrors()
            .ownershipDisclosureFileSize,
        ).toEqual(
          `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        );
      });

      it('should inform you if ownership disclosure file size is zero', () => {
        const caseExternal = new CaseExternalInformationFactory({
          ownershipDisclosureFile: new File([], 'test.pdf'),
          ownershipDisclosureFileSize: 0,
          wizardStep: '3',
        });
        expect(
          caseExternal.getFormattedValidationErrors()
            .ownershipDisclosureFileSize,
        ).toEqual('Your Ownership Disclosure Statement file size is empty');
      });

      it('should not error on ownershipDisclosureFileSize when ownershipDisclosureFile is undefined', () => {
        const caseExternal = new CaseExternalInformationFactory({
          wizardStep: '3',
        });
        expect(
          caseExternal.getFormattedValidationErrors()
            .ownershipDisclosureFileSize,
        ).toBeUndefined();
      });

      it('should error on ownershipDisclosureFileSize when ownershipDisclosureFile is defined', () => {
        const caseExternal = new CaseExternalInformationFactory({
          ownershipDisclosureFile: new File([], 'testFile.pdf'),
          wizardStep: '3',
        });
        expect(
          caseExternal.getFormattedValidationErrors()
            .ownershipDisclosureFileSize,
        ).toEqual('Your Ownership Disclosure Statement file size is empty');
      });
    });
  });

  describe('wizard step 4', () => {
    it('requires all wizard step 1, 2, 3, and 4 items', () => {
      let caseExternal = new CaseExternalInformationFactory({
        wizardStep: '4',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: 'Filing Type is required',
        hasIrsNotice: 'Indicate whether you received an IRS notice',
        partyType: 'Select a party type',
        petitionFile: 'Upload a Petition',
        preferredTrialCity: 'Select a preferred trial location',
        procedureType: 'Select a case procedure',
        stinFile: 'Upload a statement of taxpayer identification',
      });

      caseExternal = new CaseExternalInformationFactory({
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: 'Petitioner & Spouse',
        petitionFile: new File([], 'test.pdf'),
        stinFile: new File([], 'test.pdf'),
        wizardStep: '4',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: 'Select a case type',
        contactPrimary: {
          address1: 'Address is a required field.',
          city: 'City is a required field.',
          countryType: 'Country Type is a required field.',
          name: 'Name is a required field.',
          phone: 'Phone is a required field.',
          postalCode: 'Zip Code is a required field.',
          state: 'State is a required field.',
        },
        contactSecondary: {
          address1: 'Address is a required field.',
          city: 'City is a required field.',
          countryType: 'Country Type is a required field.',
          name: 'Name is a required field.',
          phone: 'Phone is a required field.',
          postalCode: 'Zip Code is a required field.',
          state: 'State is a required field.',
        },
        petitionFileSize: 'Your Petition file size is empty',
        preferredTrialCity: 'Select a preferred trial location',
        procedureType: 'Select a case procedure',
        stinFileSize: 'Your STIN file size is empty',
      });
    });

    it('returns no validation errors if all required fields from all steps are present', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: 'domestic',
          name: 'Test Primary',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        contactSecondary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: 'domestic',
          name: 'Test Secondary',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: 'Petitioner & Spouse',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        preferredTrialCity: 'Boise, Idaho',
        procedureType: 'Regular',
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '4',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
      expect(caseExternal.isValid()).toBeTruthy();
    });
  });
});
