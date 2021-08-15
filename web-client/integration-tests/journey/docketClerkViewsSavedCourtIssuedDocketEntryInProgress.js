import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkViewsSavedCourtIssuedDocketEntryInProgress = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk views an in-progress docket entry for the given court-issued document', async () => {
    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );
    expect(cerebralTest.getState('isEditingDocketEntry')).toBeTruthy();
    expect(cerebralTest.getState('form.eventCode')).toEqual(
      orderDocument.eventCode,
    );
  });
};
