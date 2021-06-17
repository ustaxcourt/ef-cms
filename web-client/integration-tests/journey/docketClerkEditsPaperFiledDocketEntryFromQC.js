export const docketClerkEditsPaperFiledDocketEntryFromQC = test => {
  return it('Docket clerk edits paper-filed docket entry from QC', async () => {
    await test.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'A',
    });

    await test.runSequence('openConfirmPaperServiceModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Answer',
    );
  });
};
