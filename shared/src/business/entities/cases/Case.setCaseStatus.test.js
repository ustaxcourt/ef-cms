const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES, CHIEF_JUDGE } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setCaseStatus', () => {
  it('should update the case status and set the associated judge to the chief judge if the new status is General Docket - Not At Issue', () => {
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

  it('should update the case status, leave the associated judge unchanged, and call closeCase if the new status is Closed', () => {
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
    expect(closeCaseSpy).toBeCalled();
    closeCaseSpy.mockRestore();
  });
});
