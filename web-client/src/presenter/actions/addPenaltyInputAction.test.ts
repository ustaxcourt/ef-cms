import { MAX_NUMBER_DEFICIENCY_STATISTIC_PENALTIES } from '@shared/business/entities/EntityConstants';
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

  it('does not add a new element to the penalties array if its length is the maximum', async () => {
    const result = await runAction(addPenaltyInputAction, {
      state: {
        modal: {
          penalties: new Array(MAX_NUMBER_DEFICIENCY_STATISTIC_PENALTIES).fill(
            '',
          ),
        },
      },
    });

    const { penalties } = result.state.modal;

    expect(penalties.length).toEqual(MAX_NUMBER_DEFICIENCY_STATISTIC_PENALTIES);
  });
});
