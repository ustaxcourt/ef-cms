const {
  getCaseConsolidationStatus,
  isCaseStatusEligible,
} = require('./caseConsolidation');

describe('caseConsolidation', () => {
  describe('isCaseStatusEligible', () => {
    it('should fail when the pending case status is ineligible', () => {
      const result = isCaseStatusEligible('Closed');

      expect(result).toEqual(false);
    });

    it('should pass when a case has an eligible case status', () => {
      const result = isCaseStatusEligible('Submitted');

      expect(result).toEqual(true);
    });
  });

  describe('getCaseConsolidationStatus', () => {
    let leadCaseEntity;
    let pendingCaseEntity;

    beforeEach(() => {
      leadCaseEntity = {
        preferredTrialCity: 'Birmingham, AL',
        procedureType: 'regular',
        status: 'Submitted',
      };

      pendingCaseEntity = {
        preferredTrialCity: 'Birmingham, AL',
        procedureType: 'regular',
        status: 'Submitted',
      };
    });

    it('should fail when case statuses are not the same', () => {
      pendingCaseEntity.status = 'new';

      const result = getCaseConsolidationStatus({
        leadCaseEntity,
        pendingCaseEntity,
      });

      expect(result.canConsolidate).toEqual(false);
      expect(result.reason).toEqual('Case status is not the same.');
    });

    it('should fail when case procedures are not the same', () => {
      pendingCaseEntity.procedureType = 'small';

      const result = getCaseConsolidationStatus({
        leadCaseEntity,
        pendingCaseEntity,
      });

      expect(result.canConsolidate).toEqual(false);
      expect(result.reason).toEqual('Case procedure is not the same.');
    });

    it('should fail when case trial locations are not the same', () => {
      pendingCaseEntity.preferredTrialCity = 'Miami, FL';

      const result = getCaseConsolidationStatus({
        leadCaseEntity,
        pendingCaseEntity,
      });

      expect(result.canConsolidate).toEqual(false);
      expect(result.reason).toEqual('Place of trial is not the same.');
    });

    it('should pass when both cases are eligible for consolidation', () => {
      const result = getCaseConsolidationStatus({
        leadCaseEntity,
        pendingCaseEntity,
      });

      expect(result.canConsolidate).toEqual(true);
      expect(result.reason).toEqual('');
    });
  });
});
