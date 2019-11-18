import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, draftOrderIndex) => {
  return it('Docket Clerk views the docket entry for the given document', async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const document = caseDetailFormatted.docketRecordWithDocument.find(
      entry => (entry.document.documentId = documentId),
    );

    expect(document).toBeTruthy();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: document.docketNumber,
      documentId: document.documentId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');
  });
};
