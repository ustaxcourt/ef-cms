const { CaseExternal } = require('./CaseExternal');
const { MAX_FILE_SIZE_BYTES, PARTY_TYPES } = require('../EntityConstants');

const { VALIDATION_ERROR_MESSAGES } = CaseExternal;

describe('CaseExternal entity', () => {
  describe('isValid', () => {
    it('requires ownership disclosure if filing type is a business', () => {
      const caseExternal = new CaseExternal({
        businessType: PARTY_TYPES.corporation,
        caseType: 'Other',
        filingType: 'A business',
        hasIrsNotice: false,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile);
    });
    it('does not require ownership disclosure if filing type not set', () => {
      const petition = new CaseExternal({
        caseType: 'Other',
        hasIrsNotice: false,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        petition.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
    it('does not require ownership disclosure if filing type not a business', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'not a biz',
        hasIrsNotice: false,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFile,
      ).toBeUndefined();
    });
    it('requires stinFile', () => {
      const caseExternal = new CaseExternal({
        businessType: PARTY_TYPES.corporation,
        caseType: 'Other',
        filingType: 'A business',
        hasIrsNotice: false,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(caseExternal.getFormattedValidationErrors().stinFile).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFile,
      );
    });
  });

  describe('Petition file size', () => {
    it('should inform you if petition file size is greater than the PDF max file size', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: MAX_FILE_SIZE_BYTES + 5,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[0].message);
    });

    it('should inform you if petition file size is zero', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        petitionFile: {},
        petitionFileSize: 0,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
    });

    it('should not error on petitionFileSize when petitionFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toBeUndefined();
    });

    it('should error on petitionFileSize when petitionFile is defined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        petitionFile: new File([], 'testPetitionFile.pdf'),
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
    });
  });

  describe('STIN file size', () => {
    it('should inform you if stin file size is greater than the file max size', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        stinFile: new File([], 'test.pdf'),
        stinFileSize: MAX_FILE_SIZE_BYTES + 5,
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[0].message,
      );
    });

    it('should inform you if stin file size is zero', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 0,
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[1],
      );
    });

    it('should not error on stinFileSize when stinFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().stinFileSize,
      ).toBeUndefined();
    });

    it('should error on stinFileSize when stinFile is defined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        stinFile: new File([], 'testStinFile.pdf'),
      });
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[1],
      );
    });
  });

  describe('ownership disclosure file size', () => {
    it('should inform you if ownership disclosure file size is greater than the PDF max file size', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        ownershipDisclosureFile: new File([], 'odsFile.pdf'),
        ownershipDisclosureFileSize: MAX_FILE_SIZE_BYTES + 5,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(
        VALIDATION_ERROR_MESSAGES.ownershipDisclosureFileSize[0].message,
      );
    });

    it('should inform you if ownership disclosure file size is zero', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        ownershipDisclosureFile: new File([], 'test.pdf'),
        ownershipDisclosureFileSize: 0,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFileSize[1]);
    });

    it('should not error on ownershipDisclosureFileSize when ownershipDisclosureFile is undefined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toBeUndefined();
    });

    it('should error on ownershipDisclosureFileSize when ownershipDisclosureFile is defined', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        ownershipDisclosureFile: new File([], 'testStinFile.pdf'),
        partyType: PARTY_TYPES.nextFriendForMinor,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
      });
      expect(
        caseExternal.getFormattedValidationErrors().ownershipDisclosureFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.ownershipDisclosureFileSize[1]);
    });
  });
});
