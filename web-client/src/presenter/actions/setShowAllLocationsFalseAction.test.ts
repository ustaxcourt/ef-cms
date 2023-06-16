import { runAction } from '@web-client/presenter/test.cerebral';
import { setShowAllLocationsFalseAction } from './setShowAllLocationsFalseAction';

describe('setShowAllLocationsFalseAction', () => {
  it('sets state.modal.showAllLocations to false', async () => {
    const { state } = await runAction(setShowAllLocationsFalseAction, {
      state: {
        modal: {
          showAllLocations: true,
        },
      },
    });

    expect(state.modal.showAllLocations).toBeFalsy();
  });
});
