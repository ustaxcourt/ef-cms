import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const respondentViewsCaseDetailOfBatchedCase = test => {
  return it('Respondent views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    expect(test.getState('caseDetail.documents').length).toEqual(2);
  });
};
