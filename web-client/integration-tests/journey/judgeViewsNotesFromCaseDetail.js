const { isCodeEnabled } = require('../../../../codeToggles');

export const judgeViewsNotesFromCaseDetail = test => {
  return it('Judge views added notes from case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    if (isCodeEnabled(6979)) {
      expect(test.getState('judgesNote.notes')).toEqual(
        'this is a note added from the modal',
      );
    } else {
      expect(test.getState('caseDetail.judgesNote.notes')).toEqual(
        'this is a note added from the modal',
      );
    }
  });
};
