import {
  CASE_TYPES_MAP,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
} from '../EntityConstants';
import { CaseExternal } from './CaseExternal';
import { PDF } from '../documents/PDF';
import { applicationContext } from '../../test/createTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = CaseExternal;

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
      expect(
        caseExternal.getFormattedValidationErrors().corporateDisclosureFile,
      ).toEqual(VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);
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
        petition.getFormattedValidationErrors().corporateDisclosureFile,
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
        caseExternal.getFormattedValidationErrors().corporateDisclosureFile,
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
      expect(caseExternal.getFormattedValidationErrors().stinFile).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFile,
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
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[0].message);
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
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
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
        caseExternal.getFormattedValidationErrors().petitionFileSize,
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
      expect(
        caseExternal.getFormattedValidationErrors().petitionFileSize,
      ).toEqual(VALIDATION_ERROR_MESSAGES.petitionFileSize[1]);
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
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[0].message,
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
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[1],
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
        caseExternal.getFormattedValidationErrors().stinFileSize,
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
      expect(caseExternal.getFormattedValidationErrors().stinFileSize).toEqual(
        VALIDATION_ERROR_MESSAGES.stinFileSize[1],
      );
    });
  });

  describe('Corporate disclosure file size', () => {
    it('should inform the user when the corporate disclosure file size is greater than the allowed file size', () => {
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

      expect(
        caseExternal.getFormattedValidationErrors().corporateDisclosureFile
          .size,
      ).toEqual(PDF.VALIDATION_ERROR_MESSAGES.size[0].message);
    });

    it('should inform the user when the corporate disclosure file is an empty file', () => {
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

      expect(
        caseExternal.getFormattedValidationErrors().corporateDisclosureFile
          .size,
      ).toEqual(PDF.VALIDATION_ERROR_MESSAGES.size[1]);
    });
  });
});
