import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsDeletesOrderFromCase = cerebralTest => {
  return it('Petitions clerk deletes Order from case', async () => {
    let formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await cerebralTest.runSequence('archiveDraftDocumentModalSequence', {
      docketEntryId: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
      documentTitle: draftOrder.documentTitle,
      redirectToCaseDetail: true,
    });

    await cerebralTest.runSequence('archiveDraftDocumentSequence');

    formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Document deleted.',
    );
    expect(
      cerebralTest.getState('viewerDraftDocumentToDisplay'),
    ).toBeUndefined();
    expect(
      cerebralTest.getState('draftDocumentViewerDocketEntryId'),
    ).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.messages').length).toBe(1);

    expect(
      formatted.draftDocuments.find(
        doc => doc.docketEntryId === draftOrder.docketEntryId,
      ),
    ).toBeFalsy();
  });
};
