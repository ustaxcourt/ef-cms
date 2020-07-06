import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOpinions = test => {
  return it('should view todays opinions', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoTodaysOpinionsSequence', {});

    expect(test.getState('todaysOpinions')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'T.C. Opinion',
          numberOfPages: 1,
        }),
      ]),
    );
  });
};
