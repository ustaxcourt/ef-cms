export const petitionsClerkClicksCaseDetailTabFromMessageDetail = test => {
  return it('petitions clerk clicks case detail tab from message detail', async () => {
    expect(test.getState('currentPage')).toEqual('MessageDetail');

    // simulate click on the case detail primary tab
    test.setState('currentViewMetadata.caseDetail.primaryTab', 'drafts');
    await test.runSequence('caseDetailPrimaryTabChangeSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(
      test.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toBeTruthy();
  });
};
