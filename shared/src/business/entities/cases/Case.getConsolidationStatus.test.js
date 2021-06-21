const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getConsolidationStatus', () => {
  let leadCaseEntity;
  let pendingCaseEntity;

  beforeEach(() => {
    leadCaseEntity = new Case(
      {
        ...MOCK_CASE,
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.submitted,
      },
      { applicationContext },
    );

    pendingCaseEntity = new Case(
      {
        ...MOCK_CASE,
        docketNumber: '102-19',
        procedureType: 'Regular',
        status: CASE_STATUS_TYPES.submitted,
      },
      { applicationContext },
    );
  });

  it('should fail when case statuses are not the same', () => {
    pendingCaseEntity.status = CASE_STATUS_TYPES.calendared;

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual(['Case status is not the same']);
  });

  it('should fail when cases are the same', () => {
    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: leadCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual(['Cases are the same']);
  });

  it('should fail when case procedures are not the same', () => {
    pendingCaseEntity.procedureType = 'small';

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual(['Case procedure is not the same']);
  });

  it('should fail when case requested place of trials are not the same', () => {
    pendingCaseEntity.preferredTrialCity = 'Flavortown, AR';

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual(['Place of trial is not the same']);
  });

  it('should fail when case judges are not the same', () => {
    pendingCaseEntity.associatedJudge = 'Some judge';

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual(['Judge is not the same']);
  });

  it('should fail when case statuses are both ineligible', () => {
    leadCaseEntity.status = CASE_STATUS_TYPES.closed;
    pendingCaseEntity.status = CASE_STATUS_TYPES.closed;

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual([
      'Case status is Closed and cannot be consolidated',
    ]);
  });

  it('should only return the ineligible failure if the pending case status is ineligible', () => {
    leadCaseEntity.status = CASE_STATUS_TYPES.submitted;
    pendingCaseEntity.status = CASE_STATUS_TYPES.closed;
    pendingCaseEntity.procedureType = 'small';
    pendingCaseEntity.trialLocation = 'Flavortown, AR';
    pendingCaseEntity.associatedJudge = 'Some judge';

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual([
      'Case status is Closed and cannot be consolidated',
    ]);
  });

  it('should return all reasons for the failure if the case status is eligible', () => {
    pendingCaseEntity.procedureType = 'small';
    pendingCaseEntity.preferredTrialCity = 'Flavortown, AR';
    pendingCaseEntity.associatedJudge = 'Some judge';

    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(false);
    expect(result.reason).toEqual([
      'Case procedure is not the same',
      'Place of trial is not the same',
      'Judge is not the same',
    ]);
  });

  it('should pass when both cases are eligible for consolidation', () => {
    const result = leadCaseEntity.getConsolidationStatus({
      caseEntity: pendingCaseEntity,
    });

    expect(result.canConsolidate).toEqual(true);
    expect(result.reason).toEqual([]);
  });
});
