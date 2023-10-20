import { CaseQC } from './CaseQC';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('CaseQC entity', () => {
  describe('validation', () => {
    it('throws an exception when not provided an application context', () => {
      expect(() => new CaseQC({}, {} as any)).toThrow();
    });

    it('returns the expected set of errors for an empty object', () => {
      const caseQcEntity = new CaseQC({}, { applicationContext });
      const customMessages = extractCustomMessages(
        caseQcEntity.getValidationRules(),
      );

      expect(caseQcEntity.getFormattedValidationErrors()).toEqual({
        caseCaption: customMessages.caseCaption[0],
        caseType: customMessages.caseType[0],
        docketNumber: customMessages.docketNumber[0],
        hasVerifiedIrsNotice: customMessages.hasVerifiedIrsNotice[0],
        partyType: customMessages.partyType[0],
        procedureType: customMessages.procedureType[0],
        sortableDocketNumber: customMessages.sortableDocketNumber[0],
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
