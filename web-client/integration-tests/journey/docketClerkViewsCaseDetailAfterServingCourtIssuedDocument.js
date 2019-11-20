import { Case } from '../../../shared/src/business/entities/cases/Case';

export default (test, draftOrderIndex) => {
  return it('Docketclerk views case detail after serving court-issued document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const { documentId } = test.draftOrders[draftOrderIndex];

    const documents = test.getState('caseDetail.documents');
    const orderDocument = documents.find(doc => doc.documentId === documentId);

    expect(orderDocument.servedAt).toBeDefined();

    if (orderDocument.eventCode === 'O') {
      expect(test.getState('caseDetail.status')).toEqual(Case.STATUS_TYPES.new);
    } else {
      expect(test.getState('caseDetail.status')).toEqual(
        Case.STATUS_TYPES.closed,
      );
    }
  });
};
