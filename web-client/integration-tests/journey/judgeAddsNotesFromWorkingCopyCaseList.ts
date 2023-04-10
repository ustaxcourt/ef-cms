import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export const judgeAddsNotesFromWorkingCopyCaseList = cerebralTest => {
  return it('Judge adds case notes from working copy case list', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );

    let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
      state: cerebralTest.getState(),
    });

    const { docketNumber } = workingCopyHelper.formattedCases[0];

    await cerebralTest.runSequence(
      'openAddEditUserCaseNoteModalFromListSequence',
      {
        docketNumber,
      },
    );

    expect(cerebralTest.getState('modal')).toEqual({
      caseTitle: 'Mona Schultz',
      docketNumber,
      notes: undefined,
      showModal: 'AddEditUserCaseNoteModal',
    });

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(cerebralTest.getState('modal')).toEqual({
      caseTitle: 'Mona Schultz',
      docketNumber,
      notes: 'this is a note added from the modal',
      showModal: 'AddEditUserCaseNoteModal',
    });

    await cerebralTest.runSequence('updateUserCaseNoteOnWorkingCopySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState(
        `trialSessionWorkingCopy.userNotes.${docketNumber}.notes`,
      ),
    ).toEqual('this is a note added from the modal');
  });
};
