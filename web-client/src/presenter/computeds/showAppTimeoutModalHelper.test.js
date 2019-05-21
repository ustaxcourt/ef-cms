import { runCompute } from 'cerebral/test';
import { showAppTimeoutModalHelper } from './showAppTimeoutModalHelper';

describe('showAppTimeoutModalHelper', () => {
  it('shows the modal', async () => {
    const result = await runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: 'AppTimeoutModal',
        user: {},
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: true });
  });

  it('does not show the modal due to no user', async () => {
    const result = await runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: true,
        user: null,
      },
    });

    expect(result).toEqual({ beginIdleMonitor: false, showModal: false });
  });

  it('does not show the modal due to different modal state component', async () => {
    const result = await runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: 'IncorrectTimeoutModal',
        user: {},
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: false });
  });
});
