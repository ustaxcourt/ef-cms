import { assignSelectedWorkItemsAction } from './assignSelectedWorkItemsAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    assignWorkItemsInteractor: () => null,
  }),
};

describe('setPathAction', () => {
  it('updates only the section queue items to have the new assignee informaion', async () => {
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
