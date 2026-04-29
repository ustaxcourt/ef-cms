import { runAction } from '@web-client/presenter/test.cerebral';
import { setReadOnlyModeModalAction } from './setReadOnlyModeModalAction';

describe('setReadOnlyModeModalAction', () => {
  it('should set state.modal.showModal to ReadOnlyModeEngagedModal when transitioning from false to true', async () => {
    const result = await runAction(setReadOnlyModeModalAction, {
      props: { readOnlyMode: true },
      state: { readOnlyMode: false, modal: {} },
    });

    expect(result.state.modal.showModal).toEqual('ReadOnlyModeEngagedModal');
  });

  it('should explicitly NOT set state.modal.showModal if readOnlyMode was already true', async () => {
    const result = await runAction(setReadOnlyModeModalAction, {
      props: { readOnlyMode: true },
      state: { readOnlyMode: true, modal: {} },
    });

    expect(result.state.modal.showModal).toBeUndefined();
  });

  it('should NOT set state.modal.showModal to ReadOnlyModeEngagedModal when transitioning to false', async () => {
    const result = await runAction(setReadOnlyModeModalAction, {
      props: { readOnlyMode: false },
      state: { readOnlyMode: true, modal: { showModal: 'OtherModal' } },
    });

    expect(result.state.modal.showModal).toEqual('OtherModal');
  });
});
