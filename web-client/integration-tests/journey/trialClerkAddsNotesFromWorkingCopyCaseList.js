import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export const trialClerkAddsNotesFromWorkingCopyCaseList = test => {
  return it('Trial Clerk adds case notes from working copy case list', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('TrialSessionWorkingCopy');

    let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
      state: test.getState(),
    });

    const { docketNumber } = workingCopyHelper.formattedCases[0];

    await test.runSequence('openAddEditUserCaseNoteModalFromListSequence', {
      docketNumber,
    });

    expect(test.getState('modal')).toEqual({
      caseTitle: 'Mona Schultz',
      docketNumber,
      notes: undefined,
      showModal: 'AddEditUserCaseNoteModal',
    });

    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(test.getState('modal')).toEqual({
      caseTitle: 'Mona Schultz',
      docketNumber,
      notes: 'this is a note added from the modal',
      showModal: 'AddEditUserCaseNoteModal',
    });

    await test.runSequence('updateUserCaseNoteOnWorkingCopySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(
      test.getState(`trialSessionWorkingCopy.userNotes.${docketNumber}.notes`),
    ).toEqual('this is a note added from the modal');
  });
};
