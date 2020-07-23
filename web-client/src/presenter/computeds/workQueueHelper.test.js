import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
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
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
      showStartPetitionButton: true,
    });
  });

  it('returns the expected state when selected work items are not set', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
      showStartPetitionButton: true,
    });
  });

  it('returns My Messages for workQueueTitle if showing individual internal work queue', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result).toMatchObject({
      workQueueTitle: 'My Messages',
    });
  });

  it('returns Section Messages for workQueueTitle if showing section internal work queue', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
          queue: 'section',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result).toMatchObject({
      workQueueTitle: 'Section Messages',
    });
  });

  it('returns My Document QC for workQueueTitle if showing individual non-internal work queue', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });
    expect(result).toMatchObject({
      workQueueTitle: 'My Document QC',
    });
  });

  it('returns Document QC for workQueueTitle if showing section non-internal work queue and current user is not a docket or petitions clerk', () => {
    const user = {
      role: ROLES.adc,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });
    expect(result).toMatchObject({
      workQueueTitle: 'Document QC',
    });
  });

  it('returns Section Document QC for workQueueTitle if showing section non-internal work queue and current user is a docket clerk', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });
    expect(result).toMatchObject({
      workQueueTitle: 'Section Document QC',
    });
  });

  it('shows the start a case button when role is petitions clerk', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
      showStartPetitionButton: true,
    });
  });

  it('does not show the start a case button when role is docket clerk', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
      showStartPetitionButton: false,
    });
  });

  it('shows the case status column when role is judge', () => {
    const user = {
      role: ROLES.judge,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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

  it('shows the case status column when role is chambers', () => {
    const user = {
      role: ROLES.chambers,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
      role: ROLES.judge,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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

  it('shows the from column when role is chambers', () => {
    const user = {
      role: ROLES.chambers,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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

  it('shows "Received" as filed label on messages inbox', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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

  it('shows in progress petitions for a petitionsclerk', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
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
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result.showProcessedByColumn).toEqual(true);
    expect(result.showInProgressTab).toEqual(true);
  });
});
