import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddsCaseToHearing = test => {
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
      value: test.createdTrialSessions[1],
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'calendarNotes',
      value: 'test note for hearing',
    });

    await test.runSequence('setForHearingSequence');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formattedCase.hearings).toMatchObject([
      {
        addedToSessionAt: expect.anything(),
        calendarNotes: 'test note for hearing',
        trialSessionId: test.createdTrialSessions[1],
      },
    ]);
  });
};
