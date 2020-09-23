import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkViewsCaseDetail = (
  test,
  expectedDocumentCount = 3,
) => {
  return it('Petitions clerk views case detail', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(CASE_STATUS_TYPES.new);
    expect(test.getState('caseDetail.docketEntries').length).toEqual(
      expectedDocumentCount,
    );
    expect(test.getState('caseDetail.associatedJudge')).toEqual(CHIEF_JUDGE);

    const caseDetail = test.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(caseDetail.userId).toBeDefined();
  });
};
