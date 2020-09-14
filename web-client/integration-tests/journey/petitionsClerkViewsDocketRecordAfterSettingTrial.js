export const petitionsClerkViewsDocketRecordAfterSettingTrial = (
  test,
  overrides = {},
) => {
  return it('Petitions clerk views docket record for a case after calendaring', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const documents = test.getState('caseDetail.docketEntries');

    const noticeOfTrial = documents.find(
      entry => entry.documentType === 'Notice of Trial',
    );

    const standingPretrialDocTitle =
      overrides.documentTitle || 'Standing Pretrial Order';

    const standingPretrialDoc = documents.find(
      entry => entry.documentTitle === standingPretrialDocTitle,
    );

    expect(noticeOfTrial).toBeTruthy();
    expect(standingPretrialDoc).toBeTruthy();
  });
};
