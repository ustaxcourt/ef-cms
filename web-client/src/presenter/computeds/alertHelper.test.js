import { runCompute } from 'cerebral/test';

import alertHelper from './alertHelper';

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
      showSingleMessage: true,
      showMultipleMessages: false,
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
      showSingleMessage: false,
      showMultipleMessages: false,
      showTitleOnly: true,
    });
  });

  it('alertError is undefined', async () => {
    const result = await runCompute(alertHelper, {
      state: {},
    });
    expect(result).toMatchObject({
      showErrorAlert: false,
      showSingleMessage: false,
      showMultipleMessages: false,
      showTitleOnly: false,
    });
  });
});
