export const userViewsMessages = (cerebralTest, box, queue) => {
  return it('logged in user views messages', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box,
      queue,
    });

    const messages = cerebralTest.getState('messages');

    expect(messages).toBeDefined();
  });
};
