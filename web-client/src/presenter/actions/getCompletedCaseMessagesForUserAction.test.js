import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCompletedCaseMessagesForUserAction } from './getCompletedCaseMessagesForUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCompletedCaseMessagesForUserAction', () => {
  const message = {
    messageId: '180bfc0c-4e8e-448a-802a-8fe027be85ef',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getCompletedCaseMessagesForUserInteractor.mockReturnValue([message]);
  });

  it('returns the messages retrieved from the use case', async () => {
    const results = await runAction(getCompletedCaseMessagesForUserAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(results.output.messages).toEqual([message]);
  });
});
