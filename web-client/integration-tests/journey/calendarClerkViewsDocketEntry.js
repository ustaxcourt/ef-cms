import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, draftOrderIndex) => {
  return it('Calendar Clerk views the docket entry for the given document', async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const docketRecordEntry = caseDetailFormatted.docketRecordWithDocument.find(
      entry => (entry.document.documentId = documentId),
    );

    expect(docketRecordEntry.document).toBeTruthy();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: docketRecordEntry.document.documentId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');
  });
};
