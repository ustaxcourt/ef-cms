import { runAction } from '@web-client/presenter/test.cerebral';
import { setFormFiledByAsUserAction } from './setFormFiledByAsUserAction';

describe('setFormFiledByAsUserAction', () => {
  const userName = 'test user';
  it('sets state.form.isDocumentRequired to true if a file is not attached on the form', async () => {
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
