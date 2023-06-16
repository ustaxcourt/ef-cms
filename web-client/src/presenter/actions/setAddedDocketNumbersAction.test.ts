import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddedDocketNumbersAction } from './setAddedDocketNumbersAction';

describe('setAddedDocketNumbersAction', () => {
  it('sets the state.addedDocketNumbers based on the stored draftOrderState', async () => {
    const { state } = await runAction(setAddedDocketNumbersAction, {
      state: {
        documentToEdit: {
          draftOrderState: {
            addedDocketNumbers: ['101-20'],
          },
        },
      },
    });

    expect(state.addedDocketNumbers).toEqual(['101-20']);
  });
});
