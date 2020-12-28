import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrders = (test, testClient) => {
  return it('should view todays orders', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoTodaysOrdersSequence', {});

    //verifying that todays orders are sorted by most recent servedAt date
    expect(test.getState('todaysOrders.results')[0]).toMatchObject({
      documentTitle: test.documentTitle2,
      documentType: 'Order',
      numberOfPages: 1,
    });
    expect(test.getState('todaysOrders.results')[1]).toMatchObject({
      documentTitle: test.documentTitle1,
      documentType: 'Order',
      numberOfPages: 1,
    });

    await test.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: testClient.docketEntryId,
      docketNumber: testClient.docketNumber,
      isPublic: true,
      useSameTab: true,
    });

    expect(window.location.href).toContain(testClient.docketEntryId);
    window.location.href = undefined;
  });
};
