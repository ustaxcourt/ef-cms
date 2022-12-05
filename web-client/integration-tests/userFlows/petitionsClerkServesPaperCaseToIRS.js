export const petitionsClerkServesPaperCaseToIRS = cerebralTest => {
  return it('Petitions clerk serves paper petition to IRS', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const petitionDocketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.eventCode === 'P').docketEntryId;

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      redirectUrl: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${petitionDocketEntryId}`,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );
  });
};
