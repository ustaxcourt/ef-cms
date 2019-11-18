import { documentDetailHelper as documentDetailHelperComputed } from '../../src/presenter/computeds/documentDetailHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, draftOrderIndex) => {
  return it('Docket Clerk views draft order', async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => (doc.documentId = documentId),
    );
    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: draftOrderDocument.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    const documentDetailHelperOrder = runCompute(
      withAppContextDecorator(documentDetailHelperComputed),
      {
        state: test.getState(),
      },
    );

    expect(documentDetailHelperOrder.showAddDocketEntryButton).toBeTruthy();
  });
};
