export const docketClerkEditsPaperFiledDocketEntry = test => {
  return it('Docket clerk edits paper-filed docket entry', async () => {
    await test.runSequence('gotoEditDocketEntrySequence', {
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
