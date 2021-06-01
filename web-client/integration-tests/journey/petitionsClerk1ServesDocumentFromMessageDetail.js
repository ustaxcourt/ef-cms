export const petitionsClerk1ServesDocumentFromMessageDetail = test => {
  return it('petitions clerk 1 serves document from message detail', async () => {
    await test.runSequence('openConfirmServePaperFiledDocumentSequence', {
      docketEntryId: test.docketEntryId,
      redirectUrl: `/messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    expect(test.getState('redirectUrl')).toBe(
      `/messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    );
    expect(test.getState('docketEntryId')).toBe(test.docketEntryId);

    expect(test.getState('modal.showModal')).toBe(
      'ConfirmInitiatePaperDocumentServiceModal',
    );

    const previousDocumentUrl = test.getState('iframeSrc');

    await test.runSequence('serveCourtIssuedDocumentSequence', {});

    expect(test.getState('alertSuccess')).toEqual({
      message: 'Document served. ',
    });
    expect(test.getState('currentPage')).toBe('MessageDetail');

    const updatedDocumentUrl = test.getState('iframeSrc');
    expect(previousDocumentUrl).not.toEqual(updatedDocumentUrl);
  });
};
