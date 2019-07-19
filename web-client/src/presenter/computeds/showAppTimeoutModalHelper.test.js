import { runCompute } from 'cerebral/test';
import { showAppTimeoutModalHelper } from './showAppTimeoutModalHelper';

describe('showAppTimeoutModalHelper', () => {
  it('shows the modal', () => {
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: 'AppTimeoutModal',
        user: {},
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: true });
  });

  it('does not show the modal due to no user', () => {
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: true,
        user: null,
      },
    });

    expect(result).toEqual({ beginIdleMonitor: false, showModal: false });
  });

  it('does not show the modal due to different modal state component', () => {
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: 'IncorrectTimeoutModal',
        user: {},
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: false });
  });
});
