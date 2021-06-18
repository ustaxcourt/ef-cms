export const docketClerkRemovesSignatureFromUploadedCourtIssuedDocument =
  test => {
    return it('Docket Clerk removes signature from an uploaded court issued document', async () => {
      await test.runSequence('openConfirmRemoveSignatureModalSequence', {
        docketEntryIdToEdit: test.docketEntryId,
      });

      await test.runSequence('removeSignatureSequence');

      expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

      const caseDocument = test
        .getState('caseDetail.docketEntries')
        .find(d => d.docketEntryId === test.docketEntryId);

      expect(caseDocument.signedAt).toEqual(null);
    });
  };
