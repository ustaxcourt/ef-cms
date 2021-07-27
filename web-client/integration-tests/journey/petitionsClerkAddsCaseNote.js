export const petitionsClerkAddsCaseNote = cerebralTest => {
  return it('petitions clerk adds procedural note to a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('caseDetail.caseNote')).toBeUndefined();

    await cerebralTest.runSequence('openAddEditCaseNoteModalSequence');

    expect(cerebralTest.getState('modal')).toMatchObject({
      notes: undefined,
    });

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(cerebralTest.getState('modal')).toMatchObject({
      notes: 'this is a note added from the modal',
    });

    await cerebralTest.runSequence('updateCaseNoteSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('caseDetail.caseNote')).toEqual(
      'this is a note added from the modal',
    );
  });
};
