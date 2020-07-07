import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsDraftOrder = (
  test,
  {
    currentRichText = '<p>This is a test order.</p>',
    setRichText = '<p>This is an edited test order.</p>',
  },
) => {
  return it('Petitions Clerk edits draft order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await test.runSequence('gotoEditOrderSequence', {
      docketNumber: draftOrder.docketNumber,
      documentIdToEdit: draftOrder.documentId,
    });

    expect(draftOrder.draftState.richText).toEqual(currentRichText);

    test.setState('form.richText', setRichText);
    await test.runSequence('submitCourtIssuedOrderSequence');

    const formattedAfterEdit = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const editedDraftOrder = formattedAfterEdit.draftDocuments[0];

    expect(editedDraftOrder.draftState.richText).toEqual(setRichText);
    expect(test.getState('currentPage')).toEqual('SignOrder');
  });
};
