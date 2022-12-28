const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  CLOSED_CASE_STATUSES,
} = require('../EntityConstants');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setCaseStatus', () => {
  it('should update the case status and set the associated judge to the chief judge when the new status is "General Docket - Not At Issue"', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus(CASE_STATUS_TYPES.generalDocket);

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(updatedCase.associatedJudge).toEqual(CHIEF_JUDGE);
  });

  it('should update the case status and set the associated judge to the chief judge when the new status is "General Docket - Ready for Trial"', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

    expect(updatedCase.status).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(updatedCase.associatedJudge).toEqual(CHIEF_JUDGE);
  });

  it('should update the case status, leave the associated judge unchanged, and call closeCase when the new status is "Closed"', () => {
    const closeCaseSpy = jest.spyOn(Case.prototype, 'closeCase');

    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus(CASE_STATUS_TYPES.closed);

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
    expect(updatedCase.associatedJudge).toEqual('Judge Buch');
    expect(closeCaseSpy).toHaveBeenCalled();
    closeCaseSpy.mockRestore();
  });

  it('should update the case status, leave the associated judge unchanged, and call closeCase when the new status is "Closed - Dismissed"', () => {
    const closeCaseSpy = jest.spyOn(Case.prototype, 'closeCase');

    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus(CASE_STATUS_TYPES.closedDismissed);

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closedDismissed);
    expect(updatedCase.associatedJudge).toEqual('Judge Buch');
    expect(closeCaseSpy).toHaveBeenCalled();
    closeCaseSpy.mockRestore();
  });

  it('should update the case status and call reopenCase when the new status is NOT a closed case status and the previous status is a closed case status', () => {
    const reopenCaseSpy = jest.spyOn(Case.prototype, 'reopenCase');

    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
        status: CLOSED_CASE_STATUSES[0],
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus(CASE_STATUS_TYPES.generalDocket);

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(reopenCaseSpy).toHaveBeenCalled();
  });
});
