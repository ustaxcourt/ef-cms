import { CaseQC } from './CaseQC';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('CaseQC entity', () => {
  describe('validation', () => {
    it('returns the expected set of errors for an empty object', () => {
      const caseQcEntity = new CaseQC(
        {},
        { authorizedUser: mockDocketClerkUser },
      );

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
        { authorizedUser: mockDocketClerkUser },
      );

      expect(caseQcEntity.getFormattedValidationErrors()).toEqual(null);
      expect(caseQcEntity.isValid()).toEqual(true);
    });
  });
});
