import { runCompute } from 'cerebral/test';

import { workQueueHelper } from './workQueueHelper';

describe('workQueueHelper', () => {
  it('returns the expected state when set', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
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
      showStartCaseButton: false,
    });
  });

  it('returns the expected state when not set', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
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
      showStartCaseButton: false,
    });
  });

  it('shows the start a case button when role is petitions clerk', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: 'petitionsclerk',
        },
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result).toMatchObject({
      showStartCaseButton: true,
    });
  });

  it('shows the start a case button when role is docket clerk', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: 'docketclerk',
        },
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result).toMatchObject({
      showStartCaseButton: true,
    });
  });
});
