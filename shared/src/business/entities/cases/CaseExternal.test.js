const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const { CaseExternal } = require('./CaseExternal');

describe('CaseExternal entity', () => {
  describe('isValid', () => {
    it('requires ownership disclosure if filing type is a business', () => {
      const caseExternal = new CaseExternal({
        businessType: 'Corporation',
        caseType: 'other',
        filingType: 'A business',
        hasIrsNotice: false,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual('Upload an Ownership Disclosure Statement');
    });
    it('does not require ownership disclosure if filing type not set', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        hasIrsNotice: false,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
    it('does not require ownership disclosure if filing type not a business', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'not a biz',
        hasIrsNotice: false,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
    it('requires stinFile', () => {
      const caseExternal = new CaseExternal({
        businessType: 'Corporation',
        caseType: 'other',
        filingType: 'A business',
        hasIrsNotice: false,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(caseExternal.getFormattedValidationErrors().stinFile).toEqual(
        'Upload a statement of taxpayer identification',
      );
    });
  });

  describe('Petition file size', () => {
    it('should inform you if petition file size is greater than 500MB', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: MAX_FILE_SIZE_BYTES + 5,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(
        `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should inform you if petition file size is zero', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        petitionFileSize: 0,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual('Your Petition file size is empty');
    });

    it('should not error on petitionFileSize when petitionFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toBeUndefined();
    });

    it('should error on petitionFileSize when petitionFile is defined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: new File([], 'testPetitionFile.pdf'),
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual('Your Petition file size is empty');
    });
  });

  describe('STIN file size', () => {
    it('should inform you if stin file size is greater than 500MB', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        stinFile: new File([], 'test.pdf'),
        stinFileSize: MAX_FILE_SIZE_BYTES + 5,
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should inform you if stin file size is zero', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 0,
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        'Your STIN file size is empty',
      );
    });

    it('should not error on stinFileSize when stinFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().stinFileSize,
      ).toBeUndefined();
    });

    it('should error on stinFileSize when stinFile is defined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        stinFile: new File([], 'testStinFile.pdf'),
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        'Your STIN file size is empty',
      );
    });
  });

  describe('ownership disclosure file size', () => {
    it('should inform you if ownership disclosure file size is greater than 500MB', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        ownershipDisclosureFile: new File([], 'odsFile.pdf'),
        ownershipDisclosureFileSize: MAX_FILE_SIZE_BYTES + 5,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(
        `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should inform you if ownership disclosure file size is zero', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        ownershipDisclosureFile: new File([], 'test.pdf'),
        ownershipDisclosureFileSize: 0,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual('Your Ownership Disclosure Statement file size is empty');
    });

    it('should not error on ownershipDisclosureFileSize when ownershipDisclosureFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toBeUndefined();
    });

    it('should error on ownershipDisclosureFileSize when ownershipDisclosureFile is defined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        ownershipDisclosureFile: new File([], 'testStinFile.pdf'),
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual('Your Ownership Disclosure Statement file size is empty');
    });
  });
});
