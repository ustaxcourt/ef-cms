export const removePendingItemFromCase = (cerebralTest, clerkName) => {
  return it(`${clerkName} removes a pending item from a case`, async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const documents = cerebralTest.getState('caseDetail.docketEntries');

    const pendingDocument = documents.find(
      document => document.pending === true,
    );

    await cerebralTest.runSequence(
      'openConfirmRemoveCaseDetailPendingItemModalSequence',
      {
        docketEntryId: pendingDocument.docketEntryId,
      },
    );

    await cerebralTest.runSequence('removeCaseDetailPendingItemSequence');
  });
};
