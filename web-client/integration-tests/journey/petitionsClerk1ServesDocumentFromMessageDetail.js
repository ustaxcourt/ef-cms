export const petitionsClerk1ServesDocumentFromMessageDetail = cerebralTest => {
  return it('petitions clerk 1 serves document from message detail', async () => {
    await cerebralTest.runSequence(
      'openConfirmServePaperFiledDocumentSequence',
      {
        docketEntryId: cerebralTest.docketEntryId,
        redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
      },
    );

    expect(cerebralTest.getState('redirectUrl')).toBe(
      `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
    );
    expect(cerebralTest.getState('docketEntryId')).toBe(
      cerebralTest.docketEntryId,
    );

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'ConfirmInitiatePaperDocumentServiceModal',
    );

    await cerebralTest.setState('iframeSrc', undefined);

    await cerebralTest.runSequence('serveCourtIssuedDocumentSequence', {});

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: 'Document served. ',
    });
    expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');

    expect(cerebralTest.getState('iframeSrc')).not.toBeUndefined();
  });
};
