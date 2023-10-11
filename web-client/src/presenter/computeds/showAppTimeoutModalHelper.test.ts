import { runCompute } from '@web-client/presenter/test.cerebral';
import { showAppTimeoutModalHelper } from './showAppTimeoutModalHelper';

describe('showAppTimeoutModalHelper', () => {
  it('shows the modal', () => {
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        idleLogoutState: {
          state: 'COUNTDOWN',
        },
        user: {},
      },
    });

    expect(result).toMatchObject({ showModal: true });
  });

  it('does not show the modal due to no user', () => {
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'AppTimeoutModal',
        },
        user: undefined,
      },
    });

    expect(result).toMatchObject({ showModal: false });
  });

  it('does not show the modal due to different modal state component', () => {
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'IncorrectTimeoutModal',
        },
        user: {},
      },
    });

    expect(result).toMatchObject({ showModal: false });
  });
});
