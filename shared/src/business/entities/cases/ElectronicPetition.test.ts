import {
  CASE_TYPES_MAP,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  PARTY_TYPES,
} from '../EntityConstants';
import { ElectronicPetition } from './ElectronicPetition';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseExternal entity', () => {
  describe('isValid', () => {
    it('requires corporate disclosure if filing type is a business', () => {
      const caseExternal = new ElectronicPetition(
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
        caseExternal.getFormattedValidationErrors()!.corporateDisclosureFile,
      ).toEqual('Upload a Corporate Disclosure Statement');
    });

    it('does not require corporate disclosure if filing type not set', () => {
      const petition = new ElectronicPetition(
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
      const caseExternal = new ElectronicPetition(
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
      const caseExternal = new ElectronicPetition(
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

      expect(caseExternal.getFormattedValidationErrors()!.stinFile).toEqual(
        'Upload a Statement of Taxpayer Identification Number (STIN)',
      );
    });
  });

  describe('Petition file size', () => {
    it('should inform you if petition file size is greater than the PDF max file size', () => {
      const caseExternal = new ElectronicPetition(
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
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual(
        `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should inform you if petition file size is zero', () => {
      const caseExternal = new ElectronicPetition(
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
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual('Your Petition file size is empty');
    });

    it('should not error on petitionFileSize when petitionFile is undefined', () => {
      const caseExternal = new ElectronicPetition(
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
      const caseExternal = new ElectronicPetition(
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
        caseExternal.getFormattedValidationErrors()!.petitionFileSize,
      ).toEqual('Your Petition file size is empty');
    });
  });

  describe('STIN file size', () => {
    it('should inform you if stin file size is greater than the file max size', () => {
      const caseExternal = new ElectronicPetition(
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

      expect(caseExternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should inform you if stin file size is zero', () => {
      const caseExternal = new ElectronicPetition(
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

      expect(caseExternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        'Your STIN file size is empty',
      );
    });

    it('should not error on stinFileSize when stinFile is undefined', () => {
      const caseExternal = new ElectronicPetition(
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

    it('should error on stinFileSize when stinFile is undefined', () => {
      const caseExternal = new ElectronicPetition(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.nextFriendForMinor,
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          stinFile: new File([], 'testStinFile.pdf'),
          stinFileSize: undefined,
        },
        { applicationContext },
      );

      expect(caseExternal.getFormattedValidationErrors()!.stinFileSize).toEqual(
        'Your STIN file size is empty',
      );
    });
  });

  describe('corporate disclosure file size', () => {
    it('should inform you if corporate disclosure file size is greater than the PDF max file size', () => {
      const caseExternal = new ElectronicPetition(
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
        caseExternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual(
        `Your Corporate Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should inform you if corporate disclosure file size is zero', () => {
      const caseExternal = new ElectronicPetition(
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
        caseExternal.getFormattedValidationErrors()!
          .corporateDisclosureFileSize,
      ).toEqual('Your Corporate Disclosure Statement file size is empty');
    });

    it('should not error on corporateDisclosureFileSize when corporateDisclosureFile is undefined', () => {
      const caseExternal = new ElectronicPetition(
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

    it('should error on corporateDisclosureFileSize when corporateDisclosureFile is undefined', () => {
      const caseExternal = new ElectronicPetition(
        {
          caseType: CASE_TYPES_MAP.other,
          corporateDisclosureFile: new File([], 'testStinFile.pdf'),
          corporateDisclosureFileSize: undefined,
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
      ).toEqual('Your Corporate Disclosure Statement file size is empty');
    });
  });
});
