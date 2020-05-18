import { runAction } from 'cerebral/test';
import { setDefaultPenaltiesAction } from './setDefaultPenaltiesAction';

describe('setDefaultPenaltiesAction', () => {
  it('sets a default state for the penalties array', async () => {
    const result = await runAction(setDefaultPenaltiesAction, {
      state: {
        modal: {
          meta: {
            penalties: null,
          },
        },
      },
    });

    const { penalties } = result.state.modal.meta;

    expect(penalties.length).toEqual(5);
  });
});
