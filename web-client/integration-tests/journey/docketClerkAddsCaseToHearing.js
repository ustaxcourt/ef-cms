import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddsCaseToHearing = (
  test,
  notes = 'test note for hearing',
  index = 1,
) => {
  return it('docket clerk adds case to hearing', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openSetForHearingModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.createdTrialSessions[index],
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'calendarNotes',
      value: notes,
    });

    await test.runSequence('setForHearingSequence');
    expect(test.getState('validationErrors')).toEqual({});

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formattedCase.hearings).toMatchObject([
      {
        addedToSessionAt: expect.anything(),
        calendarNotes: notes,
        trialSessionId: test.createdTrialSessions[index],
      },
    ]);
  });
};
