import { runCompute } from 'cerebral/test';

import workQueueHelper from './workQueueHelper';

describe('workQueueHelper', () => {
  it('returns the expected state when set', async () => {
    const result = await runCompute(workQueueHelper, {
      state: {
        selectedWorkItems: [true],
        workQueueToDisplay: { queue: 'section', box: 'inbox' },
      },
    });
    expect(result).toMatchObject({
      showSendToBar: true,
      showSectionWorkQueue: true,
      showIndividualWorkQueue: false,
      showInbox: true,
      showOutbox: false,
    });
  });

  it('returns the expected state when not set', async () => {
    const result = await runCompute(workQueueHelper, {
      state: {
        selectedWorkItems: [],
        workQueueToDisplay: { queue: 'my', box: 'outbox' },
      },
    });
    expect(result).toMatchObject({
      showSendToBar: false,
      showSectionWorkQueue: false,
      showIndividualWorkQueue: true,
      showInbox: false,
      showOutbox: true,
    });
  });
});
