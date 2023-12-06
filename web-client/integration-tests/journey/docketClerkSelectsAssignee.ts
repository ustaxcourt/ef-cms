export const docketClerkSelectsAssignee = cerebralTest => {
  return it('Docket clerk select an assignee', async () => {
    expect(cerebralTest.getState('assigneeId')).toBeUndefined();
    await cerebralTest.runSequence('selectAssigneeSequence', {
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Docketclerk',
    });
    expect(cerebralTest.getState('assigneeId')).toBeDefined();
  });
};
