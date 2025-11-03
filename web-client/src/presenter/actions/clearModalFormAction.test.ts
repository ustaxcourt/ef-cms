import { clearModalStateAction } from './clearModalStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearModalFormAction', () => {
  it('should clear the value of state.modal.form', async () => {
    const result = await runAction(clearModalStateAction, {
      state: {
        modal: {
          form: {
            someOtherProperty: '1',
            someProperty: true,
          },
        },
      },
    });

    expect(result.state.modal).toEqual({});
  });
});
