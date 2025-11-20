import { clearRemoteStatusAction } from './clearRemoteStatusAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearRemoteStatusAction', () => {
  it('should unset the remoteTrialGrantedDate from modal state', async () => {
    const result = await runAction(clearRemoteStatusAction, {
      state: {
        modal: {
          remoteTrialGrantedDate: '2023-10-14T00:00:00.000Z',
          otherField: 'should remain',
        },
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toBeUndefined();
    expect(result.state.modal.otherField).toEqual('should remain');
  });

  it('should handle when remoteTrialGrantedDate is already undefined', async () => {
    const result = await runAction(clearRemoteStatusAction, {
      state: {
        modal: {
          otherField: 'should remain',
        },
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toBeUndefined();
    expect(result.state.modal.otherField).toEqual('should remain');
  });

  it('should handle when modal state is empty', async () => {
    const result = await runAction(clearRemoteStatusAction, {
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toBeUndefined();
  });
});
