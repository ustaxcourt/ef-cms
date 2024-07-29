import { addFactOrReasonAction } from '@web-client/presenter/actions/addFactOrReasonAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addFactOrReasonAction', () => {
  const TEST_KEY = 'TEST_KEY';

  it('should add a new string in state to correct key in form', async () => {
    const INITIAL_STATE = ['1', '2', '3'];
    const result = await runAction(addFactOrReasonAction, {
      props: {
        key: TEST_KEY,
      },
      state: {
        form: {
          [TEST_KEY]: INITIAL_STATE,
        },
      },
    });

    const stateArray = result.state.form[TEST_KEY];
    expect(stateArray.length).toEqual(4);
    expect(stateArray).toEqual(['1', '2', '3', '']);
  });
});
