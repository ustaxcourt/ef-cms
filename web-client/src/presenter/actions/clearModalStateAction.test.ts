import { clearModalStateAction } from './clearModalStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearModalStateAction', () => {
  it('should clear the value of state.modal', async () => {
    const result = await runAction(clearModalStateAction, {
      state: {
        modal: {
          someOtherProperty: '1',
          someProperty: true,
        },
      },
    });

    expect(result.state.modal).toEqual({});
  });
});
