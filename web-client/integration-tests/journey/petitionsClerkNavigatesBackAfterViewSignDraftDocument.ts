export const petitionsClerkNavigatesBackAfterViewSignDraftDocument =
  cerebralTest => {
    return it('Petitions clerk views sign draft document and navigates back to draft documents', async () => {
      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');

      await cerebralTest.runSequence(
        'navigateToCaseDetailWithDraftDocumentSequence',
        {
          primaryTab: 'draftDocuments',
          viewerDraftDocumentToDisplay: {
            docketEntryId: cerebralTest.docketEntryId,
          },
        },
      );

      expect(
        cerebralTest.getState('currentViewMetadata.caseDetail.primaryTab'),
      ).toEqual('drafts');
    });
  };
