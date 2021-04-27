import { getContactPrimary } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkViewsCaseDetail = (test, docketNumber = null) => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(getContactPrimary(caseDetail).contactId).toBeDefined();
  });
};
