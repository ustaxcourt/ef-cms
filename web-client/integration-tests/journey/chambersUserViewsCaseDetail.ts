import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';

export const chambersUserViewsCaseDetail = (
  cerebralTest,
  expectedDocumentCount = 2,
) => {
  return it('Chambers user views case detail', async () => {
    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.new,
    );
    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      expectedDocumentCount,
    );
    expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
      CHIEF_JUDGE,
    );
  });
};
