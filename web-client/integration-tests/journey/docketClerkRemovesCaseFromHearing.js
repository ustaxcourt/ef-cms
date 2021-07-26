import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkRemovesCaseFromHearing = cerebralTest => {
  return it('Docket clerk removes case from hearing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openRemoveFromTrialSessionModalSequence', {
      trialSessionId: cerebralTest.createdTrialSessions[1],
    });
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await cerebralTest.runSequence('removeCaseFromTrialSequence');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formattedCase.hearings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          trialSessionId: cerebralTest.createdTrialSessions[1],
        }),
      ]),
    );
  });
};
