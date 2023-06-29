import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const respondentViewsCaseDetailOfBatchedCase = cerebralTest => {
  return it('Respondent views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(2);
  });
};
