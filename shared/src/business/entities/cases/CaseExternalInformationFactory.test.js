const {
  CaseExternalInformationFactory,
} = require('./CaseExternalInformationFactory');
const {
  COUNTRY_TYPES,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
} = require('../EntityConstants');
const { ContactFactory } = require('../contacts/ContactFactory');

const caseExternalErrorMessages =
  CaseExternalInformationFactory.VALIDATION_ERROR_MESSAGES;
const contactErrorMessages = ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES;

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
        caseExternalErrorMessages.stinFile,
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
      it('should inform you if stin file size is greater than the PDF max file size', () => {
        const caseExternal = new CaseExternalInformationFactory({
          stinFile: new File([], 'test.pdf'),
          stinFileSize: MAX_FILE_SIZE_BYTES + 5,
          wizardStep: '1',
        });
        expect(
          caseExternal.getFormattedValidationErrors().stinFileSize,
        ).toEqual(caseExternalErrorMessages.stinFileSize[0].message);
      });

      it('should inform you if stin file size is zero', () => {
        const caseExternal = new CaseExternalInformationFactory({
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 0,
          wizardStep: '1',
        });
        expect(
          caseExternal.getFormattedValidationErrors().stinFileSize,
        ).toEqual(caseExternalErrorMessages.stinFileSize[1]);
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
        ).toEqual(caseExternalErrorMessages.stinFileSize[1]);
      });
    });
  });

  describe('wizard step 2', () => {
    it('requires all wizard step 1 and 2 items', () => {
      let caseExternal = new CaseExternalInformationFactory({
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        petitionFile: caseExternalErrorMessages.petitionFile,
        stinFile: caseExternalErrorMessages.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory({
        stinFile: new File([], 'test.pdf'),
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        petitionFile: caseExternalErrorMessages.petitionFile,
        stinFileSize: caseExternalErrorMessages.stinFileSize[1],
      });
    });

    it('requires hasIrsNotice and petitionFile if no params from step 2 are present', () => {
      const caseExternal = new CaseExternalInformationFactory({
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        petitionFile: caseExternalErrorMessages.petitionFile,
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
        caseType: caseExternalErrorMessages.caseType,
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
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '2',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });

    describe('petition file size', () => {
      it('should inform you if petition file size is greater than the PDF max file size', () => {
        const caseExternal = new CaseExternalInformationFactory({
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: MAX_FILE_SIZE_BYTES + 5,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
          wizardStep: '2',
        });
        expect(
          caseExternal.getFormattedValidationErrors().petitionFileSize,
        ).toEqual(caseExternalErrorMessages.petitionFileSize[0].message);
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
        ).toEqual(caseExternalErrorMessages.petitionFileSize[1]);
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
        ).toEqual(caseExternalErrorMessages.petitionFileSize[1]);
      });
    });
  });

  describe('wizard step 3', () => {
    it('requires all wizard step 1, 2, and 3 items', () => {
      let caseExternal = new CaseExternalInformationFactory({
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: caseExternalErrorMessages.filingType,
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        partyType: caseExternalErrorMessages.partyType,
        petitionFile: caseExternalErrorMessages.petitionFile,
        stinFile: caseExternalErrorMessages.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory({
        hasIrsNotice: true,
        petitionFile: new File([], 'test.pdf'),
        stinFile: new File([], 'test.pdf'),
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: caseExternalErrorMessages.caseType,
        filingType: caseExternalErrorMessages.filingType,
        partyType: caseExternalErrorMessages.partyType,
        petitionFileSize: caseExternalErrorMessages.petitionFileSize[1],
        stinFileSize: caseExternalErrorMessages.stinFileSize[1],
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
        filingType: caseExternalErrorMessages.filingType,
        partyType: caseExternalErrorMessages.partyType,
      });
    });

    it('requires ownershipDisclosureFile if filingType is A business', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'A business',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.corporation,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual(caseExternalErrorMessages.ownershipDisclosureFile);
    });

    it('does not require ownershipDisclosureFile if filingType is not A business', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'something else',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.corporation,
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
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '3',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        contactPrimary: {
          address1: contactErrorMessages.address1,
          city: contactErrorMessages.city,
          countryType: contactErrorMessages.countryType,
          name: contactErrorMessages.name,
          phone: contactErrorMessages.phone,
          postalCode: contactErrorMessages.postalCode[1],
          state: contactErrorMessages.state,
        },
      });
    });

    it('requires contactPrimary and contactSecondary if partyType is Petitioner & Spouse', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.petitionerSpouse,
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
      it('should inform you if ownership disclosure file size is greater than the PDF max file size', () => {
        const caseExternal = new CaseExternalInformationFactory({
          ownershipDisclosureFile: new File([], 'test.pdf'),
          ownershipDisclosureFileSize: MAX_FILE_SIZE_BYTES + 5,
          wizardStep: '3',
        });
        expect(
          caseExternal.getFormattedValidationErrors()
            .ownershipDisclosureFileSize,
        ).toEqual(
          caseExternalErrorMessages.ownershipDisclosureFileSize[0].message,
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
        ).toEqual(caseExternalErrorMessages.ownershipDisclosureFileSize[1]);
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
        ).toEqual(caseExternalErrorMessages.ownershipDisclosureFileSize[1]);
      });
    });
  });

  describe('wizard step 4', () => {
    it('requires all wizard step 1, 2, 3, and 4 items', () => {
      let caseExternal = new CaseExternalInformationFactory({
        wizardStep: '4',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        filingType: caseExternalErrorMessages.filingType,
        hasIrsNotice: caseExternalErrorMessages.hasIrsNotice,
        partyType: caseExternalErrorMessages.partyType,
        petitionFile: caseExternalErrorMessages.petitionFile,
        preferredTrialCity: caseExternalErrorMessages.preferredTrialCity,
        procedureType: caseExternalErrorMessages.procedureType,
        stinFile: caseExternalErrorMessages.stinFile,
      });

      caseExternal = new CaseExternalInformationFactory({
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitionFile: new File([], 'test.pdf'),
        stinFile: new File([], 'test.pdf'),
        wizardStep: '4',
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        caseType: caseExternalErrorMessages.caseType,
        contactPrimary: {
          address1: contactErrorMessages.address1,
          city: contactErrorMessages.city,
          countryType: contactErrorMessages.countryType,
          name: contactErrorMessages.name,
          phone: contactErrorMessages.phone,
          postalCode: contactErrorMessages.postalCode[1],
          state: contactErrorMessages.state,
        },
        contactSecondary: {
          address1: contactErrorMessages.address1,
          city: contactErrorMessages.city,
          countryType: contactErrorMessages.countryType,
          name: contactErrorMessages.name,
          phone: contactErrorMessages.phone,
          postalCode: contactErrorMessages.postalCode[1],
          state: contactErrorMessages.state,
        },
        petitionFileSize: caseExternalErrorMessages.petitionFileSize[1],
        preferredTrialCity: caseExternalErrorMessages.preferredTrialCity,
        procedureType: caseExternalErrorMessages.procedureType,
        stinFileSize: caseExternalErrorMessages.stinFileSize[1],
      });
    });

    it('returns no validation errors if all required fields from all steps are present', () => {
      let caseExternal = new CaseExternalInformationFactory({
        caseType: 'Deficiency',
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Primary',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
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
