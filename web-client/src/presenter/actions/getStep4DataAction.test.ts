import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getStep4DataAction', () => {
  it('should fetch step 4 related data from state.form', async () => {
    const results = await runAction(getStep4DataAction, {
      state: {
        form: {
          preferredTrialCity: 'TEST_preferredTrialCity',
          procedureType: 'TEST_procedureType',
          testProp: 'testProp',
        },
      },
    });

    const { step4Data } = results.output;
    expect(step4Data).toEqual({
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
    });
  });
});
