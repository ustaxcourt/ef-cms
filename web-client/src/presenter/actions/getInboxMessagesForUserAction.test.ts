import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getInboxMessagesForUserAction } from './getInboxMessagesForUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getInboxMessagesForUserAction', () => {
  const message = {
    messageId: '180bfc0c-4e8e-448a-802a-8fe027be85ef',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor.mockReturnValue([message]);
  });

  it('returns the messages retrieved from the use case', async () => {
    const results = await runAction(getInboxMessagesForUserAction, {
      modules: {
        presenter,
      },
      state: { user: {} },
    });
    expect(results.output.messages).toEqual([message]);
  });
});
