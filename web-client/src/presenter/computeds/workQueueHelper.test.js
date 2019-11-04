import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { workQueueHelper } from './workQueueHelper';

const baseState = {
  constants: { USER_ROLES: User.ROLES },
};

describe('workQueueHelper', () => {
  it('returns the expected state when set', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        ...baseState,
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
        ...baseState,
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
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.petitionsClerk,
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
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.docketClerk,
        },
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result).toMatchObject({
      showStartCaseButton: true,
    });
  });

  it('shows the case status column when role is judge', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.judge,
        },
        workQueueToDisplay: { box: 'inbox', queue: 'my' },
      },
    });
    expect(result.showCaseStatusColumn).toBeTruthy();
  });

  it('shows the from column when role is judge', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.judge,
        },
        workQueueToDisplay: { box: 'inbox', queue: 'my' },
      },
    });
    expect(result.showFromColumn).toBeTruthy();
  });

  it('shows the batched by column when role is petitions clerk and box is the doc QC outbox', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.petitionsClerk,
        },
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });
    expect(result.showBatchedByColumn).toBeTruthy();
  });

  it('does not show the batched by column when role is not petitions clerk', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.docketClerk,
        },
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });
    expect(result.showBatchedByColumn).toBeFalsy();
  });

  it('does not show the batched by column when role is petitions clerk and box is not the doc QC outbox', () => {
    const result = runCompute(workQueueHelper, {
      state: {
        ...baseState,
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        user: {
          role: User.ROLES.petitionsClerk,
        },
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.showBatchedByColumn).toBeFalsy();
  });
});
