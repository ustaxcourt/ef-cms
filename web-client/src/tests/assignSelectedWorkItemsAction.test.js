import { CerebralTest } from 'cerebral/test';

import { runAction } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

import assignSelectedWorkItemsAction from '../presenter/actions/assignSelectedWorkItemsAction';

let test;
presenter.providers.applicationContext = {
  getUseCases: () => ({
    assignWorkItems: () => null,
  }),
};

test = CerebralTest(presenter);

describe('setPathAction', async () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  it('updates only the section queue items to have the new assignee informaion', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      state: {
        selectedWorkItems: [
          {
            workItemId: 'q',
          },
        ],
        sectionWorkQueue: [
          {
            workItemId: 'q',
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
          },
        ],
        workQueue: [],
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        user: {
          token: 'docketclerk',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(result.state.sectionWorkQueue).toEqual([
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'q',
      },
    ]);
    expect(result.state.workQueue).toEqual([
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
        workItemId: 'q',
      },
    ]);
    expect(result.state.selectedWorkItems).toEqual([]);
  });

  it('removes the assigned work item from the individual work queue when it is assigned to another user', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      state: {
        selectedWorkItems: [
          {
            workItemId: 'q',
          },
        ],
        sectionWorkQueue: [
          {
            workItemId: 'q',
            assigneeId: 'docketclerk',
            assigneeName: 'Docket Clerk',
          },
        ],
        workQueue: [
          {
            workItemId: 'q',
            assigneeId: 'docketclerk',
            assigneeName: 'Docket Clerk',
          },
        ],
        assigneeId: 'docketclerk1',
        assigneeName: 'Docket Clerk 1',
        user: {
          token: 'docketclerk',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(result.state.sectionWorkQueue).toEqual([
      {
        assigneeId: 'docketclerk1',
        assigneeName: 'Docket Clerk 1',
        workItemId: 'q',
      },
    ]);
    expect(result.state.workQueue).toEqual([]);
    expect(result.state.selectedWorkItems).toEqual([]);
  });
});
