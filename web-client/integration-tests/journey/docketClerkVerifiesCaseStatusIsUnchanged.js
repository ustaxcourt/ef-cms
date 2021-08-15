import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkVerifiesCaseStatusIsUnchanged = cerebralTest => {
  return it('Docket clerk verifies case status is unchanged', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = cerebralTest.getState('caseDetail');

    expect(caseDetail.status).toBe(CASE_STATUS_TYPES.closed);
    expect(caseDetail.associatedJudge).toBe('Cohen');
  });
};
