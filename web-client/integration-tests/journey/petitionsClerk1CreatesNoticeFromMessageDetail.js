export const petitionsClerk1CreatesNoticeFromMessageDetail = test => {
  return it('petitions clerk 1 creates notice from message detail', async () => {
    const { messageId } = test.getState('messageDetail')[0];
    await test.runSequence('openCreateOrderChooseTypeModalSequence', {
      parentMessageId: test.parentMessageId,
    });

    expect(test.getState('modal.showModal')).toBe('CreateOrderChooseTypeModal');

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'NOT',
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'A Notice Created From A Message',
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCreateOrderModalSequence');

    await test.runSequence('gotoCreateOrderSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
      redirectUrl: `/case-messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    expect(test.getState('currentPage')).toBe('CreateOrder');

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('currentPage')).toBe('MessageDetail');
    const messageDetail = test.getState('messageDetail');
    expect(messageDetail[0].messageId).toBe(messageId);
  });
};
