import {
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
  waitForLoadingComponentToHide,
} from '../helpers';

export const docketClerkServesDocument = (cerebralTest, docketRecordIndex?) => {
  return it('Docket Clerk serves the order after the docket entry has been created', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const docketEntryId =
      cerebralTest.draftOrders && docketRecordIndex !== undefined
        ? cerebralTest.draftOrders[docketRecordIndex].docketEntryId
        : cerebralTest.docketEntryId;

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

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    await waitForLoadingComponentToHide({ cerebralTest });

    await refreshElasticsearchIndex();
  });
};
