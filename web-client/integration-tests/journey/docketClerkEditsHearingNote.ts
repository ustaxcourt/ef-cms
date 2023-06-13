import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkEditsHearingNote = (cerebralTest, updatedNote) => {
  return it('Docket Clerk updates the note on a hearing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    let caseDetail = cerebralTest.getState('caseDetail');
    caseDetail = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    let hearing = caseDetail.hearings[caseDetail.hearings.length - 1];

    await cerebralTest.runSequence('openAddEditCalendarNoteModalSequence', {
      docketNumber: caseDetail.docketNumber,
      note: hearing.calendarNotes,
      trialSessionId: hearing.trialSessionId,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: '',
    });

    await cerebralTest.runSequence('updateHearingNoteSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      note: 'Add a note',
    });

    const textWithCountOverLimit = applicationContext
      .getUtilities()
      .getTextByCount(201);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: textWithCountOverLimit,
    });

    await cerebralTest.runSequence('updateHearingNoteSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      note: 'Limit is 200 characters. Enter 200 or fewer characters.',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: updatedNote,
    });

    await cerebralTest.runSequence('updateHearingNoteSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Note saved.',
    );

    caseDetail = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const updatedHearing = caseDetail.hearings.find(
      caseHearing => caseHearing.trialSessionId === hearing.trialSessionId,
    );

    expect(updatedHearing.calendarNotes).toEqual(updatedNote);
  });
};
