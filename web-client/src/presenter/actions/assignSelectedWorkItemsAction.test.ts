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

  it('should update multi-docketed sibling work items for the same docket entry', async () => {
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
              multiDocketedOn: ['101-25', '102-25'],
            },
            docketEntryId: 'abc',
            docketNumber: '101-25',
            workItemId: 'q',
          },
        ],
        user: {
          token: 'docketclerk',
        },
        workQueue: [
          {
            assigneeId: 'old',
            assigneeName: 'Old Name',
            docketEntryId: 'abc',
            docketNumber: '101-25',
            workItemId: 'q',
          },
          {
            assigneeId: 'old',
            assigneeName: 'Old Name',
            docketEntryId: 'abc',
            docketNumber: '102-25',
            workItemId: 'r',
          },
          {
            assigneeId: 'old',
            assigneeName: 'Old Name',
            docketEntryId: 'different',
            docketNumber: '102-25',
            workItemId: 'z',
          },
        ],
      },
    });

    expect(result.state.workQueue).toEqual([
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        docketEntryId: 'abc',
        docketNumber: '101-25',
        workItemId: 'q',
      },
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        docketEntryId: 'abc',
        docketNumber: '102-25',
        workItemId: 'r',
      },
      {
        assigneeId: 'old',
        assigneeName: 'Old Name',
        docketEntryId: 'different',
        docketNumber: '102-25',
        workItemId: 'z',
      },
    ]);
    expect(result.state.selectedWorkItems).toEqual([]);
  });
});
