const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { CaseQC } = require('./CaseQC');
const { VALIDATION_ERROR_MESSAGES } = CaseQC;
const { MOCK_CASE } = require('../../../test/mockCase');

describe('CaseQC entity', () => {
  describe('validation', () => {
    it('throws an exception when not provided an application context', () => {
      expect(() => new CaseQC({}, {})).toThrow();
    });

    it('returns the expected set of errors for an empty object', () => {
      const caseQcEntity = new CaseQC({}, { applicationContext });

      expect(caseQcEntity.getFormattedValidationErrors()).toEqual({
        caseCaption: VALIDATION_ERROR_MESSAGES.caseCaption,
        caseType: VALIDATION_ERROR_MESSAGES.caseType,
        docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
        hasVerifiedIrsNotice: VALIDATION_ERROR_MESSAGES.hasVerifiedIrsNotice,
        partyType: VALIDATION_ERROR_MESSAGES.partyType,
        procedureType: VALIDATION_ERROR_MESSAGES.procedureType,
        sortableDocketNumber: VALIDATION_ERROR_MESSAGES.sortableDocketNumber,
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
