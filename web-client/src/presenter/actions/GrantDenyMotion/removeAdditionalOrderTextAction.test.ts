import { presenter } from '@web-client/presenter/presenter-mock';
import { removeAdditionalOrderTextAction } from './removeAdditionalOrderTextAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeAdditionalOrderTextAction', () => {
  it('removes the entry at the supplied index', async () => {
    const result = await runAction(removeAdditionalOrderTextAction, {
      modules: { presenter },
      props: { index: 1 },
      state: { form: { additionalOrderText: ['a', 'b', 'c'] } },
    });

    expect(result.state.form.additionalOrderText).toEqual(['a', 'c']);
  });

  it('returns an empty array when the array is undefined', async () => {
    const result = await runAction(removeAdditionalOrderTextAction, {
      modules: { presenter },
      props: { index: 0 },
      state: { form: {} },
    });

    expect(result.state.form.additionalOrderText).toEqual([]);
  });
});
