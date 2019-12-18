export default test => {
  return it('petitions clerk deletes procedural note from a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.proceduralNote')).toEqual(
      'this is a note added from the modal',
    );

    await test.runSequence('openDeleteProceduralNoteConfirmModalSequence');

    await test.runSequence('deleteProceduralNoteSequence');

    expect(test.getState('caseDetail.proceduralNote')).toBeUndefined();
  });
};
