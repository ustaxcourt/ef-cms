import { runAction } from 'cerebral/test';

import presenter from '..';

import { completeWorkItemAction } from './completeWorkItemAction';

import sinon from 'sinon';

const updateWorkItemStub = sinon.stub().resolves(null);

presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    name: 'Docket Clerk',
    userId: 'docketclerk',
  }),
  getUseCases: () => ({
    updateWorkItem: updateWorkItemStub,
  }),
};

presenter.providers.path = {
  error() {},
  success() {},
};

describe('completeWorkItem', async () => {
  it('should attach an assignee id if one does not already exist', async () => {
    await runAction(completeWorkItemAction, {
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
    expect(
      updateWorkItemStub.getCall(0).args[0].workItemToUpdate,
    ).toMatchObject({
      assigneeId: 'docketclerk',
      assigneeName: 'Docket Clerk',
      completedBy: 'Docket Clerk',
      completedByUserId: 'docketclerk',
      completedMessage: 'work item completed',
      messages: [],
      workItemId: 'abc',
    });
  });
});
