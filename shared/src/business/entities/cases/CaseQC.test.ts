import { CaseQC } from './CaseQC';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseQC entity', () => {
  describe('validation', () => {
    it('throws an exception when not provided an application context', () => {
      expect(() => new CaseQC({}, {} as any)).toThrow();
    });

    it('returns the expected set of errors for an empty object', () => {
      const caseQcEntity = new CaseQC({}, { applicationContext });

      expect(caseQcEntity.getFormattedValidationErrors()).toEqual({
        caseCaption: CaseQC.VALIDATION_ERROR_MESSAGES.caseCaption,
        caseType: CaseQC.VALIDATION_ERROR_MESSAGES.caseType,
        docketNumber: CaseQC.VALIDATION_ERROR_MESSAGES.docketNumber,
        hasVerifiedIrsNotice:
          CaseQC.VALIDATION_ERROR_MESSAGES.hasVerifiedIrsNotice,
        partyType: CaseQC.VALIDATION_ERROR_MESSAGES.partyType,
        procedureType: CaseQC.VALIDATION_ERROR_MESSAGES.procedureType,
        sortableDocketNumber:
          CaseQC.VALIDATION_ERROR_MESSAGES.sortableDocketNumber,
      });
    });

    it('creates a valid case QC entity', () => {
      const caseQcEntity = new CaseQC(
        {
          ...MOCK_CASE,
          hasVerifiedIrsNotice: false,
        },
        { applicationContext },
      );

      expect(caseQcEntity.getFormattedValidationErrors()).toEqual(null);
      expect(caseQcEntity.isValid()).toEqual(true);
    });
  });
});
