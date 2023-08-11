import { clearFormAction } from './clearFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearFormAction', () => {
  it('should clear the form', async () => {
    const result = await runAction(clearFormAction, {
      state: { form: { formItem: 'form item' } },
    });

    expect(result.state.form).toEqual({});
  });
});
