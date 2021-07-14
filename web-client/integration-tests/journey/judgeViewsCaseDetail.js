import { contactPrimaryFromState } from '../helpers';

export const judgeViewsCaseDetail = cerebralTest => {
  return it('Judge views case detail', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const caseDetail = cerebralTest.getState('caseDetail');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimaryFromState(cerebralTest).contactId).toBeDefined();
  });
};
