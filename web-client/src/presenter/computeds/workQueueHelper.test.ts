import {
  DOCKET_SECTION,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

  it('returns My Document QC for workQueueTitle if showing individual non-internal work queue', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        selectedWorkItems: [],
        workQueueToDisplay: {
          queue: 'my',
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
        selectedWorkItems: [],
        workQueueToDisplay: {
          queue: 'section',
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
        selectedWorkItems: [],
        workQueueToDisplay: {
          queue: 'section',
        },
      },
    });
    expect(result).toMatchObject({
      workQueueTitle: 'Section Document QC',
    });
  });

  it('should set workQueueTitle to a capitalized section specific title when the user is caseServicesSupervisor and workQueueToDisplay.section exists', () => {
    const user = {
      role: ROLES.caseServicesSupervisor,
      userId: '117c6e9c-3940-4693-8bc8-0b2a7ed59b06',
    };

    let result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        selectedWorkItems: [],
        workQueueToDisplay: {
          queue: 'section',
          section: DOCKET_SECTION,
        },
      },
    });

    expect(result.workQueueTitle).toEqual('Docket Section QC');
  });

  it('should set workQueueTitle to "My Document QC" when the user is caseServicesSupervisor and workQueueToDisplay.section does not exist', () => {
    const user = {
      role: ROLES.caseServicesSupervisor,
      userId: '117c6e9c-3940-4693-8bc8-0b2a7ed59b06',
    };

    let result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        selectedWorkItems: [],
        workQueueToDisplay: {
          queue: 'section',
        },
      },
    });

    expect(result.workQueueTitle).toEqual('My Document QC');
  });

  it('shows the start a case button when role is petitions clerk', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
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
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'inbox', queue: 'my' },
      },
    });
    expect(result.showFromColumn).toBeTruthy();
  });

  it('shows in progress petitions for a petitionsclerk', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        selectedWorkItems: [],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      },
    });

    expect(result.showProcessedByColumn).toEqual(true);
    expect(result.showInProgressTab).toEqual(true);
  });

  it('should return expected flags when user is the case services supervisor', () => {
    const user = {
      role: ROLES.caseServicesSupervisor,
      userId: 'ed60ccc5-798c-4f9d-afed-f68f13f7c29b',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        selectedWorkItems: [],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      },
    });

    expect(result.hideCaseStatusColumn).toEqual(true);
    expect(result.showFiledByColumn).toEqual(true);
    expect(result.sentTitle).toEqual('Processed');
    expect(result.showDocketClerkFilter).toEqual(true);
    expect(result.showMyQueueToggle).toEqual(true);
    expect(result.showSectionSentTab).toEqual(true);
  });

  it('returns the individualInboxCount for the work queue based on the value of state.individualInboxCount', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        individualInboxCount: 3,
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result.individualInboxCount).toBe(3);
  });

  it('returns the individualInProgressCount for the work queue based on the value of state.individualInProgressCount', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        individualInProgressCount: 10,
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result.individualInProgressCount).toBe(10);
  });

  it('returns the sectionInboxCount for the work queue based on the value of state.sectionInboxCount', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        sectionInboxCount: 3,
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result.sectionInboxCount).toBe(3);
  });

  it('returns the sectionInProgressCount for the work queue based on the value of state.sectionInProgressCount', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        sectionInProgressCount: 10,
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });
    expect(result.sectionInProgressCount).toBe(10);
  });

  it('should return the correct document qc queue path URL based on the box and queue type provided', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
    };
    const mockQueue = 'test';
    const mockBox = 'my';

    const result = runCompute(workQueueHelper, {
      state: {
        ...getBaseState(user),
        sectionInProgressCount: 10,
        selectedWorkItems: [],
        workQueueToDisplay: { box: 'outbox', queue: 'my' },
      },
    });

    expect(result.getQueuePath({ box: mockBox, queue: mockQueue })).toBe(
      `/document-qc/${mockQueue}/${mockBox}`,
    );
  });

  describe('documentQCNavigationPath', () => {
    let user;
    beforeEach(() => {
      user = {
        role: ROLES.docketClerk,
        userId: '9d7fd667-42a4-4bd0-9ec7-89d2673cf8b1',
      };
    });
    it('should construct a path based on the queue and box values passed in', () => {
      const { documentQCNavigationPath } = runCompute(workQueueHelper, {
        state: {
          ...getBaseState(user),
          sectionInProgressCount: 10,
          selectedWorkItems: [],
          workQueueToDisplay: { box: 'outbox', queue: 'my' },
        },
      });

      expect(documentQCNavigationPath({ box: 'outbox', queue: 'my' })).toEqual(
        '/document-qc/my/outbox',
      );
    });

    it('should construct a path based on the queue box, and section values when section is defined', () => {
      const { documentQCNavigationPath } = runCompute(workQueueHelper, {
        state: {
          ...getBaseState(user),
          sectionInProgressCount: 10,
          selectedWorkItems: [],
          workQueueToDisplay: {
            box: 'outbox',
            queue: 'my',
            section: DOCKET_SECTION,
          },
        },
      });

      expect(
        documentQCNavigationPath({
          box: 'outbox',
          queue: 'my',
          section: DOCKET_SECTION,
        }),
      ).toEqual('/document-qc/my/outbox/selectedSection?section=docket');
    });

    it('showSwitchToMyDocQCLink should be false when the user is a case services supervisor', () => {
      user = {
        role: ROLES.caseServicesSupervisor,
        userId: '117c6e9c-3940-4693-8bc8-0b2a7ed59b06',
      };

      const { showSwitchToMyDocQCLink } = runCompute(workQueueHelper, {
        state: {
          ...getBaseState(user),
          sectionInProgressCount: 10,
          selectedWorkItems: [],
          workQueueToDisplay: {
            box: 'outbox',
            queue: 'my',
            section: DOCKET_SECTION,
          },
        },
      });

      expect(showSwitchToMyDocQCLink).toBe(false);
    });
  });
});
