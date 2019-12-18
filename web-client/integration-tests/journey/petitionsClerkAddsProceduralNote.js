export default test => {
  return it('petitions clerk adds procedural note to a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.proceduralNote')).toBeUndefined();

    await test.runSequence('openAddEditProceduralNoteModalSequence');

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

    await test.runSequence('updateProceduralNoteSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.proceduralNote')).toEqual(
      'this is a note added from the modal',
    );
  });
};
