import { addPenaltyInputAction } from './addPenaltyInputAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addPenaltyInputAction', () => {
  it('should add a new element to the penalties array', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {
          penalties: ['one', 'two', 'three'],
        },
      },
    });

    const { penalties } = result.state.modal;
    expect(penalties.length).toEqual(4);
  });

  it('does not add a new element to the penalties array if its length is 10', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {
          penalties: new Array(10).fill(''),
        },
      },
    });

    const { penalties } = result.state.modal;

    expect(penalties.length).toEqual(10);
  });
});
