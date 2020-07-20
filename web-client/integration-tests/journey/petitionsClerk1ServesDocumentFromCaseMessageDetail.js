export const petitionsClerk1ServesDocumentFromCaseMessageDetail = test => {
  return it('petitions clerk 1 serves document from case message detail', async () => {
    await test.runSequence('openConfirmServePaperFiledDocumentSequence', {
      documentId: test.documentId,
      redirectUrl: `/case-messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    expect(test.getState('redirectUrl')).toBe(
      `/case-messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    );
    expect(test.getState('documentId')).toBe(test.documentId);

    expect(test.getState('modal.showModal')).toBe(
      'ConfirmInitiatePaperDocumentServiceModal',
    );

    await test.runSequence('serveCourtIssuedDocumentSequence', {});

    expect(test.getState('alertSuccess')).toEqual({
      message: 'Document served. ',
    });
    expect(test.getState('currentPage')).toBe('MessageDetail');
  });
};
