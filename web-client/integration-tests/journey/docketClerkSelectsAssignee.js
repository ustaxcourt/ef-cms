export default test => {
  return it('Docket clerk select an assignee', async () => {
    expect(test.getState('assigneeId')).toBeNull();
    await test.runSequence('selectAssigneeSequence', {
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Docketclerk',
    });
    expect(test.getState('assigneeId')).toBeDefined();
  });
};
