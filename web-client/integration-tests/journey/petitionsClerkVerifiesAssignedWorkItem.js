export default test => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    const firstCase = test.petitionerNewCases.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current,
    );

    const firstDocument = firstCase.documents.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current,
    );

    const { workItemId } = firstDocument.workItems.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current,
    );

    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
