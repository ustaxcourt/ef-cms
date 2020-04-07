import { completeWorkItemAction } from './completeWorkItemAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const completeWorkItemInteractorStub = jest.fn().mockReturnValue(null);

presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    name: 'Docket Clerk',
    userId: 'docketclerk',
  }),
  getUseCases: () => ({
    completeWorkItemInteractor: completeWorkItemInteractorStub,
  }),
};

presenter.providers.path = {
  error() {},
  success() {},
};

describe('completeWorkItemInteractor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have undefined completedMessage if completeForm is empty', async () => {
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
      completeWorkItemInteractorStub.mock.calls[0][0].completedMessage,
    ).toBeUndefined();
  });

  it('should set completedMessage to completeMessage in completeForm', async () => {
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
        completeForm: { abc: { completeMessage: 'Completed' } },
        user: {
          name: 'Docket Clerk',
          token: 'docketclerk',
          userId: 'docketclerk',
        },
      },
    });
    expect(
      completeWorkItemInteractorStub.mock.calls[0][0].completedMessage,
    ).toEqual('Completed');
  });
});
