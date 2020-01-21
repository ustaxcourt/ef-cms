export default test => {
  return it('petitions clerk adds procedural note to a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.caseNote')).toBeUndefined();

    await test.runSequence('openAddEditCaseNoteModalSequence');

    expect(test.getState('modal')).toMatchObject({
      notes: undefined,
    });

    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(test.getState('modal')).toMatchObject({
      notes: 'this is a note added from the modal',
    });

    await test.runSequence('updateCaseNoteSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.caseNote')).toEqual(
      'this is a note added from the modal',
    );
  });
};
