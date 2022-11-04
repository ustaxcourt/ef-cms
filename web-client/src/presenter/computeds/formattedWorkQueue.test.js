import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  docketClerkUser,
  petitionsClerkUser,
  validUser,
} from '../../../../shared/src/test/mockUsers';
import { formattedWorkQueue as formattedWorkQueueComputed } from './formattedWorkQueue';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedWorkQueue', () => {
  const { CHIEF_JUDGE, DOCKET_NUMBER_SUFFIXES, DOCKET_SECTION, STATUS_TYPES } =
    applicationContext.getConstants();

  let globalUser;
  let screenMetadata = {};

  applicationContext.getCurrentUser = () => {
    return globalUser;
  };

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
      screenMetadata,
      users: [docketClerkUser, validUser],
    };
  };

  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
    {
      ...applicationContext,
    },
  );

  const baseWorkItem = {
    assigneeId: docketClerkUser.userId,
    assigneeName: null,
    caseStatus: STATUS_TYPES.generalDocket,
    createdAt: '2018-12-27T18:05:54.166Z',
    docketEntry: {
      attachments: true,
      createdAt: '2018-12-27T18:05:54.164Z',
      docketEntryId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
      documentType: 'Answer',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    docketNumberWithSuffix: '101-18S',
    section: DOCKET_SECTION,
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };

  const unassignedWorkItem = {
    ...baseWorkItem,
    assigneeId: null,
    assigneeName: null,
    workItemId: '068b42a8-bb65-4f40-946c-e0c3adf7e7d1',
  };

  const thirdWorkItem = {
    ...baseWorkItem,
    assigneeId: null,
    assigneeName: null,
    workItemId: '4bee162a-b6e5-4350-8c65-3d9c5887b5af',
  };

  const baseOutboxItem = {
    caseStatus: 'General Docket - Not at Issue',
    caseTitle: 'Then and Now',
    completedAt: '2020-12-02T16:58:30.071Z',
    completedBy: docketClerkUser.name,
    docketEntry: {},
    docketNumber: '113-19',
    entityName: 'OutboxItem',
    highPriority: false,
    section: 'docket',
    workItemId: 'fd03be29-d1c7-45a3-a462-a93e8ac40150',
  };

  const secondOutboxItem = {
    ...baseOutboxItem,
    completedBy: validUser.name,
    workItemId: '537f39c6-c33b-4516-9289-7b9f47a91f9b',
  };

  const thirdOutboxItem = {
    ...baseOutboxItem,
    completedBy: validUser.name,
    workItemId: '1fac76d7-b354-4704-9323-8eba2b29b759',
  };

  it('filters the workitems for section QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [baseWorkItem],
        workQueue: [baseWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('filters the workitems for my QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [baseWorkItem],
        workQueue: [baseWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
        },
      },
    });

    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('filters the workitems for section QC in progress', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [{ ...baseWorkItem, inProgress: true }],
        workQueue: [{ ...baseWorkItem, inProgress: true }],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      },
    });

    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('filters the workitems for my QC in progress', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [{ ...baseWorkItem, inProgress: true }],
        workQueue: [{ ...baseWorkItem, inProgress: true }],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'my',
        },
      },
    });

    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('should not show a workItem in user messages outbox if it is completed', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [
          { ...baseWorkItem, completedAt: '2019-06-17T15:27:55.801Z' },
        ],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
        },
      },
    });

    expect(result).toEqual([]);
  });

  it('filters the workitems for section QC outbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [
          { ...baseWorkItem, completedAt: '2019-06-17T15:27:55.801Z' },
        ],
        workQueue: [
          { ...baseWorkItem, completedAt: '2019-06-17T15:27:55.801Z' },
        ],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
        },
      },
    });

    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('filters the workitems for my QC outbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [
          {
            ...baseWorkItem,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: docketClerkUser.userId,
          },
        ],
        workQueue: [
          {
            ...baseWorkItem,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: docketClerkUser.userId,
          },
        ],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
        },
      },
    });

    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('filters items based on in progress cases for a petitionsclerk', () => {
    const inProgressWorkItemId = '4bd51fb7-fc46-4d4d-a506-08d48afcf46d';

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        workQueue: [
          {
            ...baseWorkItem,
            workItemId: '06f09800-2f9c-4040-b133-10966fbf6179',
          },
          {
            ...baseWorkItem,
            associatedJudge: CHIEF_JUDGE,
            caseIsInProgress: true,
            caseStatus: STATUS_TYPES.new,
            docketEntry: {
              ...baseWorkItem.docketEntry,
              status: 'processing',
            },
            workItemId: inProgressWorkItemId,
          },
        ],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual(inProgressWorkItemId);
  });

  it('does not filter workItems based on assigneeId if no filter is selected', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [baseWorkItem, unassignedWorkItem, thirdWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(3);
  });

  it('filters workItems based on assigneeId', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        screenMetadata: {
          assignmentFilterValue: {
            userId: docketClerkUser.userId,
          },
        },
        workQueue: [baseWorkItem, unassignedWorkItem, thirdWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual(baseWorkItem.workItemId);
  });

  it('filters workItems based on name when assigneeId is not present', () => {
    let result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        screenMetadata: {
          assignmentFilterValue: {
            userId: docketClerkUser.userId,
          },
        },
        workQueue: [baseOutboxItem, secondOutboxItem, thirdOutboxItem],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual(baseOutboxItem.workItemId);

    result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        screenMetadata: {
          assignmentFilterValue: {
            userId: validUser.userId,
          },
        },
        workQueue: [baseOutboxItem, secondOutboxItem, thirdOutboxItem],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(2);
    expect(result[0].workItemId).toEqual(secondOutboxItem.workItemId);
    expect(result[1].workItemId).toEqual(thirdOutboxItem.workItemId);
  });

  it('filters for unassigned workItems', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        screenMetadata: {
          assignmentFilterValue: {
            userId: 'UA',
          },
        },
        workQueue: [baseWorkItem, unassignedWorkItem, thirdWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(2);
    expect(result[0].workItemId).toEqual(unassignedWorkItem.workItemId);
    expect(result[1].workItemId).toEqual(thirdWorkItem.workItemId);
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...baseWorkItem,
            assigneeId: docketClerkUser.userId,
            highPriority: false,
            receivedAt: '2019-01-17T15:27:55.801Z',
            workItemId: 'c',
          },
          {
            ...baseWorkItem,
            highPriority: true,
            receivedAt: '2019-02-17T15:27:55.801Z',
            trialDate: '2019-01-17T00:00:00.000Z',
            workItemId: 'b',
          },
          {
            ...baseWorkItem,
            highPriority: true,
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
            workItemId: 'a',
          },
          {
            ...baseWorkItem,
            highPriority: false,
            receivedAt: '2019-04-17T15:27:55.801Z',
            workItemId: 'd',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
        },
      },
    });

    expect(result[0].workItemId).toEqual('b');
    expect(result[1].workItemId).toEqual('a');
    expect(result[2].workItemId).toEqual('c');
    expect(result[3].workItemId).toEqual('d');
  });

  describe('Consolidate Group Cases', () => {
    it('should show the work item to not be a part of a consolidated group', () => {
      const result = runCompute(formattedWorkQueue, {
        state: {
          ...getBaseState(docketClerkUser),
          workQueue: [baseWorkItem],
          workQueueToDisplay: {
            box: 'inbox',
            queue: 'section',
          },
        },
      });

      expect(result[0].inConsolidatedGroup).toBe(false);
      expect(result[0].inLeadCase).toBe(false);
      expect(result[0].consolidatedIconTooltipText).toBeUndefined();
    });

    it('should show the work item is on the lead case of a consolidated group and a tool tip "Lead Case"', () => {
      const result = runCompute(formattedWorkQueue, {
        state: {
          ...getBaseState(docketClerkUser),
          workQueue: [{ ...baseWorkItem, leadDocketNumber: '101-18' }],
          workQueueToDisplay: {
            box: 'inbox',
            queue: 'section',
          },
        },
      });

      expect(result[0].inConsolidatedGroup).toBe(true);
      expect(result[0].inLeadCase).toBe(true);
      expect(result[0].consolidatedIconTooltipText).toBe('Lead case');
    });

    it('should show the work item is a consolidated group but not the lead case and a tool tip of "Consolidated case"', () => {
      const result = runCompute(formattedWorkQueue, {
        state: {
          ...getBaseState(docketClerkUser),
          workQueue: [{ ...baseWorkItem, leadDocketNumber: '303-18' }],
          workQueueToDisplay: {
            box: 'inbox',
            queue: 'section',
          },
        },
      });

      expect(result[0].inConsolidatedGroup).toBe(true);
      expect(result[0].inLeadCase).toBe(false);
      expect(result[0].consolidatedIconTooltipText).toBe('Consolidated case');
    });
  });
});
