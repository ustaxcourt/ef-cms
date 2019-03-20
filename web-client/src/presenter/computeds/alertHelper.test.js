import { runCompute } from 'cerebral/test';

import { alertHelper } from './alertHelper';

describe('alertHelper', () => {
  it('single message error alert', async () => {
    const result = await runCompute(alertHelper, {
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

  it('no messages', async () => {
    const result = await runCompute(alertHelper, {
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

  it('alertError is undefined', async () => {
    const result = await runCompute(alertHelper, {
      state: {},
    });
    expect(result).toMatchObject({
      showErrorAlert: false,
      showMultipleMessages: false,
      showSingleMessage: false,
      showTitleOnly: false,
    });
  });
});
