import { addPenaltyInputAction } from './addPenaltyInputAction';
import { runAction } from 'cerebral/test';

describe('addPenaltyInputAction', () => {
  it('adds a new element to the penalties array', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {
          meta: {
            penalties: ['one', 'two', 'three'],
          },
        },
      },
    });

    const { penalties } = result.state.modal.meta;

    expect(penalties.length).toEqual(4);
  });

  it('creates the penalties array on modal meta state with one element if it is not set', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {
          meta: {},
        },
      },
    });

    const { penalties } = result.state.modal.meta;

    expect(penalties.length).toEqual(1);
  });
});
