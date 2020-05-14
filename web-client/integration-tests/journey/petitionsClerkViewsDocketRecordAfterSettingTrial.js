export const petitionsClerkViewsDocketRecordAfterSettingTrial = (
  test,
  overrides = {},
) => {
  return it('Petitions clerk views docket record for a case after calendaring', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketRecord = test.getState('caseDetail.docketRecord');

    const noticeOfTrial = docketRecord.find(
      entry => entry.description === 'Notice of Trial',
    );

    const standingPretrialDocTitle =
      overrides.documentTitle || 'Standing Pretrial Order';

    const standingPretrialDoc = docketRecord.find(
      entry => entry.description === standingPretrialDocTitle,
    );

    expect(noticeOfTrial).toBeTruthy();
    expect(standingPretrialDoc).toBeTruthy();
  });
};
