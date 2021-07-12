import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

export const docketClerkViewsInactiveCasesForTrialSession = cerebralTest => {
  return it('Docket clerk views inactive cases for a trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    const trialSessionDetailsFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(trialSessionDetailsFormatted.inactiveCases.length).toEqual(1);
    expect(trialSessionDetailsFormatted.inactiveCases[0].docketNumber).toEqual(
      cerebralTest.docketNumber,
    );
    expect(trialSessionDetailsFormatted.inactiveCases[0].disposition).toEqual(
      `Status was changed to ${CASE_STATUS_TYPES.submitted}`,
    );
  });
};
