import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsDeletesOrderFromCase = test => {
  return it('Petitions clerk deletes Order from case', async () => {
    let formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await test.runSequence('archiveDraftDocumentModalSequence', {
      docketEntryId: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
      documentTitle: draftOrder.documentTitle,
      redirectToCaseDetail: true,
    });

    await test.runSequence('archiveDraftDocumentSequence');

    formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(test.getState('alertSuccess.message')).toEqual('Document deleted.');
    expect(test.getState('viewerDraftDocumentToDisplay')).toBeUndefined();
    expect(test.getState('draftDocumentViewerDocketEntryId')).toBeUndefined();

    expect(
      formatted.draftDocuments.find(
        doc => doc.docketEntryId === draftOrder.docketEntryId,
      ),
    ).toBeFalsy();
  });
};
