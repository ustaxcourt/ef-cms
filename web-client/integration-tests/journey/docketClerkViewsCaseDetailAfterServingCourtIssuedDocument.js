import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkViewsCaseDetailAfterServingCourtIssuedDocument = (
  cerebralTest,
  draftOrderIndex,
  expectedCaseStatus,
) => {
  return it('Docketclerk views case detail after serving court-issued document', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const documents = cerebralTest.getState('caseDetail.docketEntries');
    const orderDocument = documents.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument.servedAt).toBeDefined();

    if (expectedCaseStatus) {
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        expectedCaseStatus,
      );
    } else if (orderDocument.eventCode === 'O') {
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.new,
      );
    } else {
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.closed,
      );
      expect(cerebralTest.getState('caseDetail.highPriority')).toEqual(false);
    }
  });
};
