import { runAction } from '@web-client/presenter/test.cerebral';
import { setFormFiledByAsUserAction } from './setFormFiledByAsUserAction';

describe('setFormFiledByAsUserAction', () => {
  const userName = 'test user';
  it('sets form.filedBy to name of the user', async () => {
    const result = await runAction(setFormFiledByAsUserAction, {
      state: {
        user: {
          name: userName,
        },
        form: {},
      },
    });

    expect(result.state.form).toMatchObject({
      filedBy: userName,
    });
  });
});
