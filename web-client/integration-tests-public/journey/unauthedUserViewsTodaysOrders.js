import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrders = (test, testClient) => {
  return it('should view todays orders', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoTodaysOrdersSequence', {});

    expect(test.getState('todaysOrders')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: test.documentTitle,
          documentType: 'Order',
          numberOfPages: 1,
        }),
      ]),
    );

    await test.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: testClient.docketEntryId,
      docketNumber: testClient.docketNumber,
      isPublic: true,
    });

    expect(window.location.href).toContain(testClient.docketEntryId);
    window.location.href = undefined;
  });
};
