import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrdersOnSealedCase = cerebralTest => {
  return it('should view todays orders on sealed case', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoTodaysOrdersSequence', {});

    expect(cerebralTest.getState('todaysOrders.results')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: cerebralTest.documentTitle,
          documentType: 'Order',
          numberOfPages: 1,
        }),
      ]),
    );
  });
};
