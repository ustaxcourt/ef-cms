export const docketClerkEditsPaperFiledDocketEntryFromQC = cerebralTest => {
  return it('Docket clerk edits paper-filed docket entry from QC', async () => {
    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'A',
    });

    await cerebralTest.runSequence('openConfirmPaperServiceModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Answer',
    );
  });
};
