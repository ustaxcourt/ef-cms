import {
  CASE_TYPES_MAP,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
} from '../EntityConstants';
import { CaseExternal } from './CaseExternal';
import { applicationContext } from '../../test/createTestApplicationContext';
import { extractCustomMessages } from '../utilities/extractCustomMessages';

describe('CaseExternal entity', () => {
  describe('isValid', () => {
    it('requires corporate disclosure if filing type is a business', () => {
      const caseExternal = new CaseExternal(
        {
          businessType: PARTY_TYPES.corporation,
          caseType: CASE_TYPES_MAP.other,
          filingType: 'A business',
          hasIrsNotice: false,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual(customMessages.corporateDisclosureFile[0]);
    });
    it('does not require corporate disclosure if filing type not set', () => {
      const petition = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          hasIrsNotice: false,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      expect(
        petition.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toBeUndefined();
    });
    it('does not require corporate disclosure if filing type not a business', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'not a biz',
          hasIrsNotice: false,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toBeUndefined();
    });
    it('requires stinFile', () => {
      const caseExternal = new CaseExternal(
        {
          businessType: PARTY_TYPES.corporation,
          caseType: CASE_TYPES_MAP.other,
          filingType: 'A business',
          hasIrsNotice: false,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(caseExternal.getFormattedValidationErrors()!.stinFile).toEqual(
        customMessages.stinFile[0],
      );
    });
  });

  describe('Petition file size', () => {
    it('should inform you if petition file size is greater than the PDF max file size', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: MAX_FILE_SIZE_BYTES + 5,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual(customMessages.petitionFileSize[1]);
    });

    it('should inform you if petition file size is zero', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          petitionFile: {},
          petitionFileSize: 0,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual(customMessages.petitionFileSize[0]);
    });

    it('should not error on petitionFileSize when petitionFile is undefined', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toBeUndefined();
    });

    it('should error on petitionFileSize when petitionFile is defined', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          petitionFile: new File([], 'testPetitionFile.pdf'),
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual(customMessages.petitionFileSize[0]);
    });
  });

  describe('STIN file size', () => {
    it('should inform you if stin file size is greater than the file max size', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          stinFile: new File([], 'test.pdf'),
          stinFileSize: MAX_FILE_SIZE_BYTES + 5,
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(caseExternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        customMessages.stinFileSize[1],
      );
    });

    it('should inform you if stin file size is zero', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 0,
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(caseExternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        customMessages.stinFileSize[0],
      );
    });

    it('should not error on stinFileSize when stinFile is undefined', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!.stinFileSize,
      ).toBeUndefined();
    });

    it('should error on stinFileSize when stinFile is defined', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          stinFile: new File([], 'testStinFile.pdf'),
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(caseExternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        customMessages.stinFileSize[0],
      );
    });
  });

  describe('corporate disclosure file size', () => {
    it('should inform you if corporate disclosure file size is greater than the PDF max file size', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: new File([], 'cdsFile.pdf'),
          corporateDisclosureFileSize: MAX_FILE_SIZE_BYTES + 5,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual(customMessages.corporateDisclosureFileSize[1]);
    });

    it('should inform you if corporate disclosure file size is zero', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: new File([], 'test.pdf'),
          corporateDisclosureFileSize: 0,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual(customMessages.corporateDisclosureFileSize[0]);
    });

    it('should not error on corporateDisclosureFileSize when corporateDisclosureFile is undefined', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      expect(
        caseExternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toBeUndefined();
    });

    it('should error on corporateDisclosureFileSize when corporateDisclosureFile is defined', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: new File([], 'testStinFile.pdf'),
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );
      const customMessages = extractCustomMessages(
        CaseExternal.VALIDATION_RULES,
      );
      expect(
        caseExternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual(customMessages.corporateDisclosureFileSize[0]);
    });
  });
});
