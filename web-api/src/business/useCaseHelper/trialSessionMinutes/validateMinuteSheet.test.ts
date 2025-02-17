import { validateMinuteSheet } from './validateMinuteSheet';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';

describe('validateMinuteSheet', () => {
  it('should return true for valid minute sheet', () => {
    expect(validateMinuteSheet(mockMinuteSheet)).toBe(true);
  });

  it('should return false for null or undefined', () => {
    expect(validateMinuteSheet(null)).toBe(false);
    expect(validateMinuteSheet(undefined)).toBe(false);
  });

  it('should return false when required objects are missing', () => {
    const invalidSheet = { ...mockMinuteSheet, trialSession: {} };
    expect(validateMinuteSheet(invalidSheet)).toBe(false);
  });

  describe('trialSession validation', () => {
    it('should return false for invalid trial session data', () => {
      const invalidTrialSession = {
        ...mockMinuteSheet,
        trialSession: {
          ...mockMinuteSheet.trialSession,
          id: 123,
        },
      };
      expect(validateMinuteSheet(invalidTrialSession)).toBe(false);

      const missingJudge = {
        ...mockMinuteSheet,
        trialSession: {
          ...mockMinuteSheet.trialSession,
          judge: null,
        },
      };
      expect(validateMinuteSheet(missingJudge)).toBe(false);
    });
  });

  describe('caseRecord validation', () => {
    it('should return false for invalid case record', () => {
      const invalidCaseRecord = {
        ...mockMinuteSheet,
        caseRecord: {
          ...mockMinuteSheet.caseRecord,
          recalls: 'not-an-array',
        },
      };
      expect(validateMinuteSheet(invalidCaseRecord)).toBe(false);
    });
  });

  describe('appearances validation', () => {
    it('should return false for invalid appearances structure', () => {
      const invalidAppearances = {
        ...mockMinuteSheet,
        appearances: {
          petitioners: {
            noAppearance: false,
            appearances: 'not-an-array',
          },
          respondents: [],
        },
      };
      expect(validateMinuteSheet(invalidAppearances)).toBe(false);
    });
  });

  describe('proceedings validation', () => {
    it('should return false for invalid proceedings structure', () => {
      const invalidProceedings = {
        ...mockMinuteSheet,
        proceedings: {
          motions: 'not-an-array',
          actionsAndFilings: [],
        },
      };
      expect(validateMinuteSheet(invalidProceedings)).toBe(false);
    });
  });

  describe('evidence validation', () => {
    it('should return false for invalid evidence structure', () => {
      const invalidEvidence = {
        ...mockMinuteSheet,
        evidence: {
          petitionerWitnesses: null,
          respondentWitnesses: [],
          exhibits: [],
        },
      };
      expect(validateMinuteSheet(invalidEvidence)).toBe(false);
    });
  });
});
