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
        caseCaption: 'Enter a case caption',
        caseType: 'Select a case type',
        docketNumber: 'Docket number is required',
        hasVerifiedIrsNotice: 'Select an option for IRS Notice provided',
        partyType: 'Select a party type',
        procedureType: 'Select a case procedure',
        sortableDocketNumber: 'Sortable docket number is required',
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
