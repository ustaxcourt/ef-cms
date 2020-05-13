export const petitionsClerkRemovesPendingItemFromCase = test => {
  return it('Petitions Clerk removes a pending item from a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const documents = test.getState('caseDetail.documents');

    const pendingDocument = documents.find(
      document => document.pending === true,
    );

    await test.runSequence(
      'openConfirmRemoveCaseDetailPendingItemModalSequence',
      {
        documentId: pendingDocument.documentId,
      },
    );

    await test.runSequence('removeCaseDetailPendingItemSequence');
  });
};
