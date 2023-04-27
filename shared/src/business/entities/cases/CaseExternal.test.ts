import { CASE_TYPES_MAP, PARTY_TYPES } from '../EntityConstants';
import { CaseExternal } from './CaseExternal';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseExternal entity', () => {
  describe('validation', () => {
    it('should require corporate disclosure when filing type is a business', () => {
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
      ).toEqual(CaseExternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);
    });

    it('should NOT require corporate disclosure when filing type not provided', () => {
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

    it('shoud NOT require corporate disclosure when filing type NOT a business', () => {
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

    it('should require a statement of taxpayer identification (STIN) file', () => {
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
        CaseExternal.VALIDATION_ERROR_MESSAGES.stinFile,
      );
    });
  });
});
