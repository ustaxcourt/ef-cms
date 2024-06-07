import { clearValidationMessageAction } from '@web-client/presenter/actions/clearValidationMessageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearValidationMessageAction', () => {
  const TEST_KEY = 'TEST_KEY';

  it('should clear validation message from state with provided key', async () => {
    const INITIAL_ERROR_MESSAGE = 'INITIAL_ERROR_MESSAGE';

    const result = await runAction(clearValidationMessageAction, {
      props: {
        key: TEST_KEY,
      },
      state: {
        validationErrors: {
          [TEST_KEY]: INITIAL_ERROR_MESSAGE,
        },
      },
    });

    const ERROR_MESSAGE = result.state.validationErrors[TEST_KEY];
    expect(ERROR_MESSAGE).toEqual(undefined);
  });
});
