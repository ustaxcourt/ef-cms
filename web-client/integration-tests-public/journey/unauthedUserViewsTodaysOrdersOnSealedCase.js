import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrdersOnSealedCase = test => {
  return it('should view todays orders on sealed case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoTodaysOrdersSequence', {});

    expect(test.getState('todaysOrders.results')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: test.documentTitle,
          documentType: 'Order',
          numberOfPages: 1,
        }),
      ]),
    );
  });
};
