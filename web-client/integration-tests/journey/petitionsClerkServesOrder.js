import { getFormattedDocketEntriesForTest } from '../helpers';

export const petitionsClerkServesOrder = test => {
  return it('Petitions Clerk serves the order', async () => {
    const { docketEntryId } = test;
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');

    await test.runSequence('openConfirmInitiateServiceModalSequence');
    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');
  });
};
