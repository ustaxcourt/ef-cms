export const petitionsClerk1ViewsMessageDetail = cerebralTest => {
  return it('petitions clerk 1 views the message detail for the message they received', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
    });

    expect(cerebralTest.getState('messageDetail')).toMatchObject([
      {
        parentMessageId: cerebralTest.parentMessageId,
      },
    ]);
  });
};
