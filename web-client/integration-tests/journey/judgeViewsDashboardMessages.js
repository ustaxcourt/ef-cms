export const judgeViewsDashboardMessages = (test, messageSubjects) => {
  return it('Judge views dashboard messages', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardJudge');

    const messages = test.getState('messages');
    expect(messages.length).toBeGreaterThan(1);

    messageSubjects.forEach(subject => {
      expect(messages.find(m => m.subject === subject)).toBeDefined();
    });
  });
};
