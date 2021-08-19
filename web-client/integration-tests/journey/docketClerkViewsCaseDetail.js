import { contactPrimaryFromState } from '../helpers';

export const docketClerkViewsCaseDetail = (
  cerebralTest,
  docketNumber = null,
) => {
  return it('Docketclerk views case detail', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || cerebralTest.docketNumber,
    });

    const caseDetail = cerebralTest.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimaryFromState(cerebralTest).contactId).toBeDefined();
  });
};
