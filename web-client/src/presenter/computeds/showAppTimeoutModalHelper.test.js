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
        modal: {
          showModal: 'AppTimeoutModal',
        },
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: true });
  });

  it('does not show the modal due to no user', () => {
    applicationContext.getCurrentUser = () => {};
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'AppTimeoutModal',
        },
      },
    });

    expect(result).toEqual({ beginIdleMonitor: false, showModal: false });
  });

  it('does not show the modal due to different modal state component', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        modal: {
          showModal: 'IncorrectTimeoutModal',
        },
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: false });
  });

  it('shows the modal if another running instance is showing the modal', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        appInstances: [
          {
            showModal: 'AppTimeoutModal',
          },
        ],
        modal: {
          showModal: '',
        },
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: true });
  });

  it('shows the modal if another running instance is NOT showing the modal but this one is', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        appInstances: [
          {
            showModal: '',
          },
        ],
        modal: {
          showModal: 'AppTimeoutModal',
        },
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: true });
  });

  it('does not show the modal if no running instance should be showing the modal', () => {
    applicationContext.getCurrentUser = () => ({});
    const result = runCompute(showAppTimeoutModalHelper, {
      state: {
        appInstances: [
          {
            showModal: '',
          },
        ],
        modal: {
          showModal: '',
        },
      },
    });

    expect(result).toEqual({ beginIdleMonitor: true, showModal: false });
  });
});
