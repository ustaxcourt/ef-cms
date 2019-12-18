import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
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
        showModal: 'AppTimeoutModal',
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: true });
  });

  it('does not show the modal due to no user', () => {
    applicationContext.getCurrentUser = () => {};
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: true,
      },
    });

    expect(result).toEqual({ beginIdleMonitor: false, showModal: false });
  });

  it('does not show the modal due to different modal state component', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        showModal: 'IncorrectTimeoutModal',
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: false });
  });
});
