import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsSavedCourtIssuedDocketEntryInProgress = (
  test,
  draftOrderIndex,
) => {
  return it('Docket Clerk views an in-progress docket entry for the given court-issued document', async () => {
    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const orderDocument = helper.formattedDraftDocuments.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');
    expect(test.getState('isEditingDocketEntry')).toBeTruthy();
    expect(test.getState('form.eventCode')).toEqual(orderDocument.eventCode);
  });
};
