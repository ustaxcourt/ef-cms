import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkRemovesCaseFromHearing = test => {
  return it('Docket clerk removes case from hearing', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openRemoveFromTrialSessionModalSequence', {
      trialSessionId: test.createdTrialSessions[1],
    });
    await test.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await test.runSequence('removeCaseFromTrialSequence');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formattedCase.hearings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          trialSessionId: test.createdTrialSessions[1],
        }),
      ]),
    );
  });
};
