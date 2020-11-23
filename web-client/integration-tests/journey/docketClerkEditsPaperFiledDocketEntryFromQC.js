const { isCodeEnabled } = require('../../../codeToggles');

export const docketClerkEditsPaperFiledDocketEntryFromQC = test => {
  return it('Docket clerk edits paper-filed docket entry from QC', async () => {
    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'A',
    });

    await test.runSequence('openConfirmPaperServiceModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    if (isCodeEnabled(6916)) {
      expect(test.getState('form.documentTitle')).toEqual(
        'Motion for Leave to File Answer',
      );
    } else {
      expect(test.getState('form.documentTitle')).toEqual(
        'Motion for Leave to File Application for Waiver of Filing Fee and Affidavit',
      );
    }
  });
};
