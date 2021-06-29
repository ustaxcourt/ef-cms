import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkVerifiesCaseStatusIsUnchanged = test => {
  return it('Docket clerk verifies case status is unchanged', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = test.getState('caseDetail');

    expect(caseDetail.status).toBe(CASE_STATUS_TYPES.closed);
    expect(caseDetail.associatedJudge).toBe('Cohen');
  });
};
