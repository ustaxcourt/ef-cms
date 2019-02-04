import { runAction } from 'cerebral/test';

import presenter from '..';

import assignSelectedWorkItemsAction from './assignSelectedWorkItemsAction';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    assignWorkItems: () => null,
  }),
};

describe('setPathAction', async () => {
  it('updates only the section queue items to have the new assignee informaion', async () => {
    const result = await runAction(assignSelectedWorkItemsAction, {
      state: {
        selectedWorkItems: [
          {
            workItemId: 'q',
          },
        ],
        workQueue: [
          {
            workItemId: 'q',
            assigneeId: 'docketclerk1',
            assigneeName: 'Docket Clerk 1',
          },
        ],
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
