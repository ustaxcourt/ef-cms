import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { showAppTimeoutModalHelper as showAppTimeoutModalHelperComputed } from './showAppTimeoutModalHelper';
import { withAppContextDecorator } from '../../withAppContext';

const showAppTimeoutModalHelper = withAppContextDecorator(
  showAppTimeoutModalHelperComputed,
  applicationContext,
);

describe('showAppTimeoutModalHelper', () => {
  it('shows the modal', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'AppTimeoutModal',
        },
        user: {},
      },
    });

    expect(result).toMatchObject({ beginIdleMonitor: true, showModal: true });
  });

  it('does not show the modal due to no user', () => {
    applicationContext.getCurrentUser = () => {};
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'AppTimeoutModal',
        },
        user: undefined,
      },
    });

    expect(result).toMatchObject({ beginIdleMonitor: false, showModal: false });
  });

  it('does not show the modal due to different modal state component', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'IncorrectTimeoutModal',
        },
        user: {},
      },
    });

    expect(result).toMatchObject({ beginIdleMonitor: true, showModal: false });
  });
});
