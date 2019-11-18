import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
export default (test, documentId) => {
  return it('Docket Clerk cancels adding a docket entry from the given order', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => (doc.documentId = documentId),
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequnce('openCancelDraftDocumentModalSequence');
    expect(test.getState('showModal')).toEqual('CancelDraftDocumentModal');

    await test.runSequence('cancelAddDraftDocumentSequence');
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('urrentPage')).toEqual('CaseDetailInternal');

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const unChangedDraftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => (doc.documentId = documentId),
    );
    expect(unChangedDraftOrderDocument).toBeTruthy();
  });
};
