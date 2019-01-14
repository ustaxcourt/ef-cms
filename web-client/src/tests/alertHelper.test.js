import { runCompute } from 'cerebral/test';

import alertHelper from '../presenter/computeds/alertHelper';

describe('alertHelper', () => {
  it('single message error alert', async () => {
    const result = await runCompute(alertHelper, {
      state: {
        alertError: {
          message: 'abc',
        }
      },
    });
    expect(result).toMatchObject({
      showErrorAlert: true,
      showSingleMessage: true,
      showMultipleMessages: false,
      showNoMessage: false,
    });
  });

  it('no messages', async () => {
    const result = await runCompute(alertHelper, {
      state: {
        alertError: {
        }
      },
    });
    expect(result).toMatchObject({
      showErrorAlert: true,
      showSingleMessage: false,
      showMultipleMessages: false,
      showNoMessage: true,
    });
  });
});
