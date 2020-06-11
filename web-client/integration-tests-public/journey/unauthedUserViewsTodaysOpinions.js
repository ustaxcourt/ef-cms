export const unauthedUserViewsTodaysOpinions = test => {
  return it('should view todays opinions', async () => {
    await test.runSequence('gotoTodaysOpinionsSequence', {});

    expect(test.getState('todaysOpinions')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'TCOP - T.C. Opinion',
          numberOfPages: 1,
        }),
      ]),
    );
  });
};
