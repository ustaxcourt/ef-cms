import { addAdditionalOrderTextAction } from './addAdditionalOrderTextAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addAdditionalOrderTextAction', () => {
  it('appends an empty string to the additionalOrderTextArray array', async () => {
    const result = await runAction(addAdditionalOrderTextAction, {
      modules: { presenter },
      state: { form: { additionalOrderTextArray: ['existing'] } },
    });

    expect(result.state.form.additionalOrderTextArray).toEqual([
      'existing',
      '',
    ]);
  });

  it('initializes additionalOrderTextArray when undefined', async () => {
    const result = await runAction(addAdditionalOrderTextAction, {
      modules: { presenter },
      state: { form: {} },
    });

    expect(result.state.form.additionalOrderTextArray).toEqual(['']);
  });
});
