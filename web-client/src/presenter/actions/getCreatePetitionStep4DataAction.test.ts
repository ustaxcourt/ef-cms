import { getCreatePetitionStep4DataAction } from '@web-client/presenter/actions/getCreatePetitionStep4DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreatePetitionStep4DataAction', () => {
  it('should fetch step 4 related data from state.form', async () => {
    const results = await runAction(getCreatePetitionStep4DataAction, {
      state: {
        form: {
          preferredTrialCity: 'TEST_preferredTrialCity',
          procedureType: 'TEST_procedureType',
          testProp: 'testProp',
        },
      },
    });

    const { createPetitionStep4Data } = results.output;
    expect(createPetitionStep4Data).toEqual({
      preferredTrialCity: 'TEST_preferredTrialCity',
      procedureType: 'TEST_procedureType',
    });
  });
});
