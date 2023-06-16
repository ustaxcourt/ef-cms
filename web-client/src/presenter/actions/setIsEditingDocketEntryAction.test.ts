import { runAction } from '@web-client/presenter/test.cerebral';
import { setIsEditingDocketEntryAction } from './setIsEditingDocketEntryAction';

describe('setIsEditingDocketEntryAction', () => {
  it('should set the value of state.isEditingDocketEntry to the value passed in to the action', async () => {
    const { state } = await runAction(setIsEditingDocketEntryAction(true), {
      modules: {},
      state: {
        isEditingDocketEntry: false,
      },
    });

    expect(state.isEditingDocketEntry).toBeTruthy();
  });
});
