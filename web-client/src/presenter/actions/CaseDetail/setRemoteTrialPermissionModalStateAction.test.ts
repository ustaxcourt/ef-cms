import { runAction } from '@web-client/presenter/test.cerebral';
import { setRemoteTrialPermissionModalStateAction } from './setRemoteTrialPermissionModalStateAction';

describe('setRemoteTrialPermissionModalStateAction', () => {
  it('should set modal.remoteTrialGrantedDate from caseDetail when date exists', async () => {
    const mockDate = '2023-10-14T00:00:00.000Z';

    const result = await runAction(setRemoteTrialPermissionModalStateAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
          remoteTrialGrantedDate: mockDate,
        },
        modal: {},
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toEqual(mockDate);
  });

  it('should set modal.remoteTrialGrantedDate to empty string when date is null', async () => {
    const result = await runAction(setRemoteTrialPermissionModalStateAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
          remoteTrialGrantedDate: null,
        },
        modal: {},
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toEqual('');
  });

  it('should set modal.remoteTrialGrantedDate to empty string when date is undefined', async () => {
    const result = await runAction(setRemoteTrialPermissionModalStateAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: {},
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toEqual('');
  });

  it('should overwrite existing modal.remoteTrialGrantedDate with new value from caseDetail', async () => {
    const oldDate = '2023-09-01T00:00:00.000Z';
    const newDate = '2023-10-14T00:00:00.000Z';

    const result = await runAction(setRemoteTrialPermissionModalStateAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
          remoteTrialGrantedDate: newDate,
        },
        modal: {
          remoteTrialGrantedDate: oldDate,
        },
      },
    });

    expect(result.state.modal.remoteTrialGrantedDate).toEqual(newDate);
  });
});
