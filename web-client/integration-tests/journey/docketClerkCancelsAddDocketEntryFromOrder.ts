import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkCancelsAddDocketEntryFromOrder = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk cancels adding a docket entry from the given order', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('openCancelDraftDocumentModalSequence');
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'CancelDraftDocumentModal',
    );

    await cerebralTest.runSequence('cancelAddDraftDocumentSequence');
    expect(cerebralTest.getState('modal')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const unChangedDraftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );
    expect(unChangedDraftOrderDocument).toBeTruthy();
  });
};
