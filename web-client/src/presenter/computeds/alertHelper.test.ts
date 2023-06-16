import { alertHelper as alertHelperComputed } from './alertHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const alertHelper = withAppContextDecorator(alertHelperComputed, {
  getCurrentUser: () => ({
    userId: '123',
  }),
});

describe('alertHelper', () => {
  it('single message error alert', () => {
    const result = runCompute(alertHelper, {
      state: {
        alertError: {
          message: 'abc',
        },
      },
    });
    expect(result).toMatchObject({
      showErrorAlert: true,
      showMultipleMessages: false,
      showSingleMessage: true,
      showTitleOnly: false,
    });
  });

  it('no messages', () => {
    const result = runCompute(alertHelper, {
      state: {
        alertError: { title: 'hello' },
      },
    });
    expect(result).toMatchObject({
      showErrorAlert: true,
      showMultipleMessages: false,
      showSingleMessage: false,
      showTitleOnly: true,
    });
  });

  it('alertError is undefined', () => {
    const result = runCompute(alertHelper, {
      state: {},
    });
    expect(result).toMatchObject({
      showErrorAlert: false,
      showMultipleMessages: false,
      showSingleMessage: false,
      showTitleOnly: false,
    });
  });

  it('responseCode is defined', () => {
    const result = runCompute(alertHelper, {
      state: {
        alertError: {
          responseCode: 504,
        },
      },
    });
    expect(result).toMatchObject({
      responseCode: 504,
    });
  });
});
