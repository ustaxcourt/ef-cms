import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from './workQueueHelper';

let globalUser;

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed, {
  ...applicationContext,
  getCurrentUser: () => {
    return globalUser;
  },
});

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

describe('workQueueHelper', () => {
  it('returns the expected state when selected work items are set', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
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
      showStartCaseButton: true,
    });
  });

  it('returns the expected state when selected work items are not set', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
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
      showStartCaseButton: true,
    });
  });

  it('shows the start a case button when role is petitions clerk', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result).toMatchObject({
      showStartCaseButton: true,
    });
  });

  it('shows the start a case button when role is docket clerk', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result).toMatchObject({
      showStartCaseButton: true,
    });
  });

  it('shows the case status column when role is judge', () => {
    const user = {
      role: User.ROLES.judge,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'inbox', queue: 'my' },
      },
    });
    expect(result.showCaseStatusColumn).toBeTruthy();
  });

  it('shows the from column when role is judge', () => {
    const user = {
      role: User.ROLES.judge,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'inbox', queue: 'my' },
      },
    });
    expect(result.showFromColumn).toBeTruthy();
  });

  it('shows the batched by column when role is petitions clerk and box is the doc QC outbox', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
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
    const user = {
      role: User.ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
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
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.showBatchedByColumn).toBeFalsy();
  });

  it('shows "Received" as filed label on messages inbox', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        notifications: {
          myInboxUnreadCount: 0,
          qcUnreadCount: 0,
        },
        selectedWorkItems: [],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.inboxFiledColumnLabel).toEqual('Received');
  });
});
