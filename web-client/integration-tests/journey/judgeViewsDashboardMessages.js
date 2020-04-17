export const judgeViewsDashboardMessages = test => {
  return it('Judge views dashboard messages', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardJudge');
    expect(test.getState('workQueue').length).toBeGreaterThan(1);
    expect(test.getState('workQueue')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              message: 'karma karma karma karma karma chameleon',
            }),
          ]),
        }),
      ]),
    );
    expect(test.getState('workQueue')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              message: "don't forget to be awesome",
            }),
          ]),
        }),
      ]),
    );
  });
};
