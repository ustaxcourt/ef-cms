import {
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
} from '../helpers';

export const docketClerkServesDocument = (test, draftOrderIndex) => {
  return it(`Docket Clerk serves the order after the docket entry has been created ${draftOrderIndex}`, async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');

    await test.runSequence('openConfirmInitiateServiceModalSequence');

    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');

    await refreshElasticsearchIndex();
  });
};
