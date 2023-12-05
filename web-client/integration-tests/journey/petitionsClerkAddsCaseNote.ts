import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

export const petitionsClerkAddsCaseNote = cerebralTest => {
  return it('petitions clerk adds procedural note to a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(cerebralTest.getState('caseDetail.caseNote')).toBeUndefined();

    await cerebralTest.runSequence('openAddEditCaseNoteModalSequence');

    expect(cerebralTest.getState('modal').notes).toBeUndefined();

    const over9000Characters = applicationContext
      .getUtilities()
      .getTextByCount(9002);

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: over9000Characters,
    });

    await cerebralTest.runSequence('updateCaseNoteSequence');

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      caseNote: 'Limit is 9000 characters. Enter 9000 or fewer characters.',
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
