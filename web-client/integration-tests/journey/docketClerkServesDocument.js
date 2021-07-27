import {
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
} from '../helpers';

export const docketClerkServesDocument = (cerebralTest, draftOrderIndex) => {
  return it(`Docket Clerk serves the order after the docket entry has been created ${draftOrderIndex}`, async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );

    await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');

    await cerebralTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );

    await refreshElasticsearchIndex();
  });
};
