import { addAdditionalOrderTextAction } from './addAdditionalOrderTextAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addAdditionalOrderTextAction', () => {
  it('appends an empty string to the additionalOrderText array', async () => {
    const result = await runAction(addAdditionalOrderTextAction, {
      modules: { presenter },
      state: { form: { additionalOrderText: ['existing'] } },
    });

    expect(result.state.form.additionalOrderText).toEqual(['existing', '']);
  });

  it('initializes additionalOrderText when undefined', async () => {
    const result = await runAction(addAdditionalOrderTextAction, {
      modules: { presenter },
      state: { form: {} },
    });

    expect(result.state.form.additionalOrderText).toEqual(['']);
  });
});
