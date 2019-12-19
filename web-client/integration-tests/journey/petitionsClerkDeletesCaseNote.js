export default test => {
  return it('petitions clerk deletes case note from a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.caseNote')).toEqual(
      'this is a note added from the modal',
    );

    await test.runSequence('openDeleteCaseNoteConfirmModalSequence');

    await test.runSequence('deleteCaseNoteSequence');

    expect(test.getState('caseDetail.caseNote')).toBeUndefined();
  });
};
