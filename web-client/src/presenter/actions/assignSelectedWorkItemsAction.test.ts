import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { assignSelectedWorkItemsAction } from './assignSelectedWorkItemsAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('assignSelectedWorkItemsAction', () => {
  it('should not update section queue items which are not matches for selected work item id', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      modules: {
        presenter,
      },
      state: {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        selectedWorkItems: [
          {
            docketEntry: {
              multiDocketedOn: [],
            },
            workItemId: 'q',
          },
        ],
        user: {
          token: 'docketclerk',
        },
        workQueue: [
          {
            workItemId: 'zz',
          },
        ],
      },
    });
    expect(result.state.workQueue).toEqual([
      {
        workItemId: 'zz',
      },
    ]);
  });

  it('should update only the section queue items to have the new assignee information', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      modules: {
        presenter,
      },
      state: {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        selectedWorkItems: [
          {
            docketEntry: {
              multiDocketedOn: [],
            },
            workItemId: 'q',
          },
        ],
        user: {
          token: 'docketclerk',
        },
        workQueue: [
          {
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
            workItemId: 'q',
          },
        ],
      },
    });
    expect(result.state.workQueue).toEqual([
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'q',
      },
    ]);
    expect(result.state.selectedWorkItems).toEqual([]);
  });

  it('should update multi-docketed member work items for the same docket entry', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      modules: {
        presenter,
      },
      state: {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        selectedWorkItems: [
          {
            docketEntry: {
              multiDocketedOn: ['101-23', '102-23', '103-23', '104-23'],
            },
            groupedMemberCases: [
              {
                workItemId: 'member-work-item-id',
              },
            ],
            workItemId: 'lead-work-item-id',
          },
        ],
        user: {
          token: 'docketclerk',
        },
        workQueue: [
          {
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
            workItemId: 'lead-work-item-id',
          },
          {
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
            workItemId: 'member-work-item-id',
          },
          {
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
            workItemId: 'member-work-item-id',
          },
          {
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
            workItemId: 'member-work-item-id',
          },
        ],
      },
    });
    expect(result.state.workQueue).toEqual([
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'lead-work-item-id',
      },
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'member-work-item-id',
      },
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'member-work-item-id',
      },
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'member-work-item-id',
      },
    ]);
    expect(result.state.selectedWorkItems).toEqual([]);
  });
});
