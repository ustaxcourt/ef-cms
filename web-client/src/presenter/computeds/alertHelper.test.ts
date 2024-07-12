import { alertHelper } from './alertHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

const user = {};

describe('alertHelper', () => {
  it('single message error alert', () => {
    const result = runCompute(alertHelper, {
      state: {
        alertError: {
          message: 'abc',
        },
        user,
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
      user,
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
      state: { user },
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
        user,
      },
    });
    expect(result).toMatchObject({
      responseCode: 504,
    });
  });
});
