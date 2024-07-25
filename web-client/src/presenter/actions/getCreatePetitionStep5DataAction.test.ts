import { getCreatePetitionStep5DataAction } from '@web-client/presenter/actions/getCreatePetitionStep5DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreatePetitionStep5DataAction', () => {
  it('should fetch step 5 related data from state.form', async () => {
    const results = await runAction(getCreatePetitionStep5DataAction, {
      state: {
        form: {
          stinFile: 'TEST_stinFile',
          stinFileSize: 'TEST_stinFileSize',
        },
      },
    });

    const { step5Data } = results.output;
    expect(step5Data).toEqual({
      stinFile: 'TEST_stinFile',
      stinFileSize: 'TEST_stinFileSize',
    });
  });
});
