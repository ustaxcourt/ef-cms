import { runAction } from '@web-client/presenter/test.cerebral';
import { setNewAccountEmailInStateAction } from '@web-client/presenter/actions/setNewAccountEmailInStateAction';

describe('setNewAccountEmailInStateAction', () => {
  const TEST_EMAIL = 'TEST_EMAIL';
  beforeAll(() => {});

  it('should call route with the correct url for create petitioner', async () => {
    const { state } = await runAction(setNewAccountEmailInStateAction, {
      props: {
        email: TEST_EMAIL,
      },
      state: {},
    });

    expect(state.cognito.email).toEqual(TEST_EMAIL);
  });
});
