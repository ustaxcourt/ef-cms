import { clearLoginFormAction } from './clearLoginFormAction';
import { runAction } from 'cerebral/test';

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
      name: '',
    });
  });
});
