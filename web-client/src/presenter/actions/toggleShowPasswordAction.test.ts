import { runAction } from '@web-client/presenter/test.cerebral';
import { toggleShowPasswordAction } from '@web-client/presenter/actions/toggleShowPasswordAction';

describe('toggleShowPasswordAction', () => {
  const TEST_PASSWORD_TYPE = 'TEST_PASSWORD_TYPE';
  beforeAll(() => {});

  it('should call route with the correct url for create petitioner', async () => {
    const INITIAL_TEST_PASSWORD_TYPE_VALUE = true;
    const { state } = await runAction(toggleShowPasswordAction, {
      props: {
        passwordType: TEST_PASSWORD_TYPE,
      },
      state: {
        [TEST_PASSWORD_TYPE]: INITIAL_TEST_PASSWORD_TYPE_VALUE,
      },
    });

    expect(state[TEST_PASSWORD_TYPE]).toEqual(
      !INITIAL_TEST_PASSWORD_TYPE_VALUE,
    );
  });
});
