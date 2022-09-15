import { getFormattedTrialSessionDetailsAction } from './getFormattedTrialSessionDetailsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFormattedTrialSessionDetailsAction', () => {
  it('should return the formatted trial session details', async () => {
    const formattedTrialSessionDetails = {
      someOtherProperty: 'more text',
      someProperty: 'text',
    };
    const result = await runAction(getFormattedTrialSessionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        formattedTrialSessionDetails,
      },
    });
    expect(result.output.formattedTrialSessionDetails).toEqual(
      formattedTrialSessionDetails,
    );
  });
});
