import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddsCaseToHearing = (
  cerebralTest,
  notes = 'test note for hearing',
  index = 1,
) => {
  return it('docket clerk adds case to hearing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openSetForHearingModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.createdTrialSessions[index],
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'calendarNotes',
      value: notes,
    });

    await cerebralTest.runSequence('setForHearingSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formattedCase.hearings).toMatchObject([
      {
        addedToSessionAt: expect.anything(),
        calendarNotes: notes,
        trialSessionId: cerebralTest.createdTrialSessions[index],
      },
    ]);
  });
};
