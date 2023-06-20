import { clearLoginFormAction } from './clearLoginFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearLoginFormAction', () => {
  it('should reset the form state', async () => {
    const result = await runAction(clearLoginFormAction, {
      state: {
        form: {
          name: 'Joe',
          nature: 'Exotic',
        },
      },
    });

    expect(result.state.form).toMatchObject({
      email: '',
    });
  });
});
