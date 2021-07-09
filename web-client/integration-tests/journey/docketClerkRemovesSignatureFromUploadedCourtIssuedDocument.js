export const docketClerkRemovesSignatureFromUploadedCourtIssuedDocument =
  cerebralTest => {
    return it('Docket Clerk removes signature from an uploaded court issued document', async () => {
      await cerebralTest.runSequence(
        'openConfirmRemoveSignatureModalSequence',
        {
          docketEntryIdToEdit: cerebralTest.docketEntryId,
        },
      );

      await cerebralTest.runSequence('removeSignatureSequence');

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const caseDocument = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(d => d.docketEntryId === cerebralTest.docketEntryId);

      expect(caseDocument.signedAt).toEqual(null);
    });
  };
