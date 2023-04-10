export const petitionsClerk1CreatesNoticeFromMessageDetail = cerebralTest => {
  return it('petitions clerk 1 creates notice from message detail', async () => {
    const { messageId } = cerebralTest.getState('messageDetail')[0];
    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence', {
      parentMessageId: cerebralTest.parentMessageId,
    });

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'CreateOrderChooseTypeModal',
    );

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'NOT',
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'A Notice Created From A Message',
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    await cerebralTest.runSequence('gotoCreateOrderSequence', {
      docketNumber: cerebralTest.docketNumber,
      documentTitle: cerebralTest.getState('modal.documentTitle'),
      documentType: cerebralTest.getState('modal.documentType'),
      eventCode: cerebralTest.getState('modal.eventCode'),
      redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
    });

    expect(cerebralTest.getState('currentPage')).toBe('CreateOrder');

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');
    const messageDetail = cerebralTest.getState('messageDetail');
    expect(messageDetail[0].messageId).toBe(messageId);
  });
};
