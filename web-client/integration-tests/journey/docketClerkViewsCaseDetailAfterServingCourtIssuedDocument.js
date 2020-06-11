import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkViewsCaseDetailAfterServingCourtIssuedDocument = (
  test,
  draftOrderIndex,
  expectedCaseStatus,
) => {
  return it('Docketclerk views case detail after serving court-issued document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const { documentId } = test.draftOrders[draftOrderIndex];

    const documents = test.getState('caseDetail.documents');
    const orderDocument = documents.find(doc => doc.documentId === documentId);

    expect(orderDocument.servedAt).toBeDefined();

    if (expectedCaseStatus) {
      expect(test.getState('caseDetail.status')).toEqual(expectedCaseStatus);
    } else if (orderDocument.eventCode === 'O') {
      expect(test.getState('caseDetail.status')).toEqual(CASE_STATUS_TYPES.new);
    } else {
      expect(test.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.closed,
      );
      expect(test.getState('caseDetail.highPriority')).toEqual(false);
    }
  });
};
