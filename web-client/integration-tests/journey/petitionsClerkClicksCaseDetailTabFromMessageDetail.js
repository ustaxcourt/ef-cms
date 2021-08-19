export const petitionsClerkClicksCaseDetailTabFromMessageDetail =
  cerebralTest => {
    return it('petitions clerk clicks case detail tab from message detail', async () => {
      expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

      // simulate click on the case detail primary tab
      cerebralTest.setState(
        'currentViewMetadata.caseDetail.primaryTab',
        'drafts',
      );
      await cerebralTest.runSequence('caseDetailPrimaryTabChangeSequence');

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      expect(
        cerebralTest.getState(
          'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
        ),
      ).toBeTruthy();
    });
  };
