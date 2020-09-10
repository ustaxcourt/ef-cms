export const docketClerkViewsNoticeOfChangeOfAddress = test => {
  return it('Docket clerk views Notice of Change of Address on the docket record', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const noticeDocument = test
      .getState('caseDetail.docketEntries')
      .find(d => d.documentTitle === 'Notice of Change of Address');

    expect(noticeDocument.servedAt).toBeDefined();
  });
};
