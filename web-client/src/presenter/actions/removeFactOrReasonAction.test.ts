import { removeFactOrReasonAction } from '@web-client/presenter/actions/removeFactOrReasonAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeFactOrReasonAction', () => {
  const KEY = 'KEY';

  it('should slice the array in state correclty', async () => {
    const { state } = await runAction(removeFactOrReasonAction, {
      props: {
        index: 2,
        key: KEY,
      },
      state: {
        form: {
          [KEY]: [1, 2, 3, 4, 5, 6],
        },
      },
    });
    expect(state.form[KEY]).toEqual([1, 2, 4, 5, 6]);
  });

  it('should leave the array in state untouched if the index is under 0', async () => {
    const { state } = await runAction(removeFactOrReasonAction, {
      props: {
        index: -2,
        key: KEY,
      },
      state: {
        form: {
          [KEY]: [1, 2, 3, 4, 5, 6],
        },
      },
    });
    expect(state.form[KEY]).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
