import { publicAlertHelper } from './publicAlertHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('publicAlertHelper', () => {
  it('single message error alert', () => {
    const result = runCompute(publicAlertHelper, {
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

  it('multiple messages error alert', () => {
    const result = runCompute(publicAlertHelper, {
      state: {
        alertError: {
          messages: ['abc', 'def', 'ghi'],
        },
      },
    });
    expect(result).toMatchObject({
      showErrorAlert: true,
      showMultipleMessages: true,
      showSingleMessage: false,
      showTitleOnly: false,
    });
  });

  it('no messages', () => {
    const result = runCompute(publicAlertHelper, {
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
    const result = runCompute(publicAlertHelper, {
      state: {},
    });
    expect(result).toMatchObject({
      showErrorAlert: false,
      showTitleOnly: false,
    });
  });

  it('responseCode', () => {
    const result = runCompute(publicAlertHelper, {
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
