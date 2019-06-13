export default test => {
  return it('Petitions clerk runs IRS batch', async () => {
    await test.runSequence('clickServeToIrsSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    expect(
      test
        .getState('workQueue')
        .find(workItem => workItem.docketNumber === test.docketNumber),
    ).toBeDefined();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'batched',
      queue: 'my',
    });

    expect(
      test
        .getState('workQueue')
        .find(workItem => workItem.docketNumber === test.docketNumber),
    ).toBeUndefined();
  });
};
