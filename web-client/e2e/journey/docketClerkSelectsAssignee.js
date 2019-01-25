export default test => {
  return it('Docket clerk select an assignee', async () => {
    expect(test.getState('assigneeId')).toBeNull();
    await test.runSequence('selectAssigneeSequence', {
      assigneeId: 'docketclerk',
      assigneeName: 'Test Docketclerk',
    });
    expect(test.getState('assigneeId')).toBeDefined();
  });
};
