export const getUserMessageCount = async (cerebralTest, box, queue) => {
  await cerebralTest.runSequence('gotoMessagesSequence', {
    box,
    queue,
  });

  return cerebralTest.getState('messages').length;
};
