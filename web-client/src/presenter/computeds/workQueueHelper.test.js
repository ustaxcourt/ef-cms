import { runCompute } from 'cerebral/test';

import { workQueueHelper } from './workQueueHelper';

describe('workQueueHelper', () => {
  it('returns the expected state when set', async () => {
    const result = await runCompute(workQueueHelper, {
      state: {
        selectedWorkItems: [true],
        workQueueToDisplay: { box: 'inbox', queue: 'section' },
      },
    });
    expect(result).toMatchObject({
      showInbox: true,
      showIndividualWorkQueue: false,
      showOutbox: false,
      showSectionWorkQueue: true,
      showSendToBar: true,
    });
  });

  it('returns the expected state when not set', async () => {
    const result = await runCompute(workQueueHelper, {
      state: {
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result).toMatchObject({
      showInbox: false,
      showIndividualWorkQueue: true,
      showOutbox: true,
      showSectionWorkQueue: false,
      showSendToBar: false,
    });
  });
});
