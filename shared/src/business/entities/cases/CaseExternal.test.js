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
        irsNoticeDate: null,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual('Ownership Disclosure Statement is required.');
    });
    it('does not require ownership disclosure if filing type not set', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        hasIrsNotice: false,
        irsNoticeDate: null,
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
        irsNoticeDate: null,
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
        irsNoticeDate: null,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(caseExternal.getFormattedValidationErrors().stinFile).toEqual(
        'Statement of Taxpayer Identification Number is required.',
      );
    });
  });

  describe('irs notice date validation', () => {
    it('should require notice date', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(caseExternal.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is a required field.',
      );
    });

    it('should not require notice date', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        caseExternal.getFormattedValidationErrors().irsNoticeDate,
      ).toBeUndefined();
    });

    it('should not require case type without indicating they have a notice ', () => {
      const caseExternal = new CaseExternal({
        filingType: 'Myself',
        hasIrsNotice: undefined,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        caseExternal.getFormattedValidationErrors().caseType,
      ).toBeUndefined();
    });

    it('should inform you if notice date is in the future', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '3009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(caseExternal.getFormattedValidationErrors().irsNoticeDate).toEqual(
        'Notice Date is in the future. Please enter a valid date.',
      );
    });
  });

  describe('Petition file size', () => {
    it('should inform you if petition file size is greater than 500MB', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: MAX_FILE_SIZE_BYTES + 5,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
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
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        petitionFileSize: 0,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(`Your Petition file size is empty.`);
    });

    it('should not error on petitionFileSize when petitionFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
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
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: new File([], 'testPetitionFile.pdf'),
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(`Your Petition file size is empty.`);
    });
  });

  describe('STIN file size', () => {
    it('should inform you if stin file size is greater than 500MB', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
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
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 0,
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        `Your STIN file size is empty.`,
      );
    });

    it('should not error on stinFileSize when stinFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
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
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: new File([], 'testStinFile.pdf'),
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        `Your STIN file size is empty.`,
      );
    });
  });

  describe('ownership disclosure file size', () => {
    it('should inform you if ownership disclosure file size is greater than 500MB', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        ownershipDisclosureFile: new File([], 'odsFile.pdf'),
        ownershipDisclosureFileSize: MAX_FILE_SIZE_BYTES + 5,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
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
        irsNoticeDate: '2009-10-13',
        ownershipDisclosureFile: new File([], 'test.pdf'),
        ownershipDisclosureFileSize: 0,
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(`Your Ownership Disclosure Statement file size is empty.`);
    });

    it('should not error on ownershipDisclosureFileSize when ownershipDisclosureFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
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
        irsNoticeDate: '2009-10-13',
        ownershipDisclosureFile: new File([], 'testStinFile.pdf'),
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(`Your Ownership Disclosure Statement file size is empty.`);
    });
  });
});
