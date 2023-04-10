import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrders = (cerebralTest, testClient) => {
  return it('should view todays orders', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoTodaysOrdersSequence', {});

    //verifying that todays orders are sorted by most recent servedAt date
    expect(cerebralTest.getState('todaysOrders.results')[0]).toMatchObject({
      documentTitle: cerebralTest.documentTitle2,
      documentType: 'Order',
      numberOfPages: 1,
    });
    expect(cerebralTest.getState('todaysOrders.results')[1]).toMatchObject({
      documentTitle: cerebralTest.documentTitle1,
      documentType: 'Order',
      numberOfPages: 1,
    });

    await cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: testClient.docketEntryId,
      docketNumber: testClient.docketNumber,
      isPublic: true,
      useSameTab: true,
    });

    expect(window.location.href).toContain(testClient.docketEntryId);
    window.location.href = undefined;
  });
};
