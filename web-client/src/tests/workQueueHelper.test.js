import { runCompute } from 'cerebral/test';

import workQueueHelper from '../presenter/computeds/workQueueHelper';

describe('workQueueHelper', () => {
  it('returns the expected state when set', async () => {
    const result = await runCompute(workQueueHelper, {
      state: {
        selectedWorkItems: [true],
        workQueueToDisplay: 'section',
      },
    });
    expect(result).toMatchObject({
      showSendToBar: true,
      showSectionWorkQueue: true,
      showIndividualWorkQueue: false,
    });
  });

  it('returns the expected state when not set', async () => {
    const result = await runCompute(workQueueHelper, {
      state: {
        selectedWorkItems: [],
        workQueueToDisplay: 'individual',
      },
    });
    expect(result).toMatchObject({
      showSendToBar: false,
      showSectionWorkQueue: false,
      showIndividualWorkQueue: true,
    });
  });
});
