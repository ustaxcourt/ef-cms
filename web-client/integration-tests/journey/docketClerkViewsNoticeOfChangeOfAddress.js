export const docketClerkViewsNoticeOfChangeOfAddress = cerebralTest => {
  return it('Docket clerk views Notice of Change of Address on the docket record', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const noticeDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.documentTitle === 'Notice of Change of Address');

    expect(noticeDocument.servedAt).toBeDefined();
  });
};
