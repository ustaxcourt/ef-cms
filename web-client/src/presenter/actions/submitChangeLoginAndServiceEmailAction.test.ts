import { runAction } from '@web-client/presenter/test.cerebral';
import { submitChangeLoginAndServiceEmailAction } from '@web-client/presenter/actions/submitChangeLoginAndServiceEmailAction';

describe('submitChangeLoginAndServiceEmailAction', () => {
  it('should call route with the correct url for create petitioner', async () => {
    const { state } = await runAction(submitChangeLoginAndServiceEmailAction, {
      props: {},
      state: {
        emailConfirmation: {
          formWasSubmitted: false,
        },
      },
    });

    expect(state.emailConfirmation.formWasSubmitted).toBe(true);
  });
});
