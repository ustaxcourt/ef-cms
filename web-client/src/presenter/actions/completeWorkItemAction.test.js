import { runAction } from 'cerebral/test';

import presenter from '..';

import completeWorkItem from './completeWorkItemAction';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateWorkItem: async () => {
      return null;
    },
  }),
};

presenter.providers.path = {
  success() {},
  error() {},
};

describe('completeWorkItem', async () => {
  it('should attach an assignee id if one does not already exist', async () => {
    const result = await runAction(completeWorkItem, {
      state: {
        user: {
          userId: 'docketclerk',
          token: 'docketclerk',
          name: 'Docket Clerk',
        },
        completeForm: {},
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  workItemId: 'abc',
                  messages: [],
                },
              ],
            },
          ],
        },
      },
      props: {
        workItemId: 'abc',
      },
      modules: {
        presenter,
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
