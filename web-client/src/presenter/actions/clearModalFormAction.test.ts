import { clearModalFormAction } from './clearModalFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearModalFormAction', () => {
  it('should clear the value of state.modal.form', async () => {
    const result = await runAction(clearModalFormAction, {
      state: {
        modal: {
          form: {
            someProperty: true,
            someOtherProperty: '1',
          },
        },
      },
    });
    expect(result.state.modal.form).toEqual({});
  });
});
