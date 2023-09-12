import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { assignSelectedWorkItemsAction } from './assignSelectedWorkItemsAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('assignSelectedWorkItemsAction', () => {
  it('does not update section queue items which are not matches for selected work item id', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      modules: {
        presenter,
      },
      state: {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        selectedWorkItems: [
          {
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
  it('updates only the section queue items to have the new assignee information', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      modules: {
        presenter,
      },
      state: {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        selectedWorkItems: [
          {
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
});
