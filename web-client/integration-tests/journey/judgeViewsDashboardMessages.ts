export const judgeViewsDashboardMessages = (cerebralTest, messageSubjects) => {
  return it('Judge views dashboard messages', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('DashboardJudge');

    const messages = cerebralTest.getState('messages');
    expect(messages.length).toBeGreaterThan(1);

    messageSubjects.forEach(subject => {
      expect(messages.find(m => m.subject === subject)).toBeDefined();
    });
  });
};
