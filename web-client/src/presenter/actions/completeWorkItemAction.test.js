import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { completeWorkItemAction } from './completeWorkItemAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

const { completeWorkItemInteractor } = applicationContext.getUseCases();

applicationContext.getCurrentUser.mockReturnValue({
  name: 'Docket Clerk',
  userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
});

presenter.providers.path = {
  error() {},
  success() {},
};

describe('completeWorkItemInteractor', () => {
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
          userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
        },
      },
    });
    expect(
      completeWorkItemInteractor.mock.calls[0][0].completedMessage,
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
          userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
        },
      },
    });
    expect(
      completeWorkItemInteractor.mock.calls[0][0].completedMessage,
    ).toEqual('Completed');
  });
});
