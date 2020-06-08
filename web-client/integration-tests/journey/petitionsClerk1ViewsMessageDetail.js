export const petitionsClerk1ViewsMessageDetail = test => {
  return it('petitions clerk 1 views the message detail for the message they received', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      messageId: test.messageId,
    });

    expect(test.getState('messageDetail')).toMatchObject({
      messageId: test.messageId,
    });
  });
};
