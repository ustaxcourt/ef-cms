import { runAction } from 'cerebral/test';

import presenter from '..';

import { completeWorkItemAction } from './completeWorkItemAction';

presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    name: 'Docket Clerk',
    userId: 'docketclerk',
  }),
  getUseCases: () => ({
    updateWorkItem: async () => {
      return null;
    },
  }),
};

presenter.providers.path = {
  error() {},
  success() {},
};

describe('completeWorkItem', async () => {
  it('should attach an assignee id if one does not already exist', async () => {
    const result = await runAction(completeWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        workItemId: 'abc',
      },
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  messages: [],
                  workItemId: 'abc',
                },
              ],
            },
          ],
        },
        completeForm: {},
        user: {
          name: 'Docket Clerk',
          token: 'docketclerk',
          userId: 'docketclerk',
        },
      },
    });
    expect(result.state.caseDetail.documents[0].workItems).toMatchObject([
      {
        assigneeId: 'docketclerk',
        assigneeName: 'Docket Clerk',
      },
    ]);
  });
});
