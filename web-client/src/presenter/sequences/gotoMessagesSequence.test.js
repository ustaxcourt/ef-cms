import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoMessagesSequence } from '../sequences/gotoMessagesSequence';
import { presenter } from '../presenter-mock';

describe('gotoMessagesSequence', () => {
  const mockUserSectionCount = 8;
  const mockUserInboxCount = 4;
  const mockMessages = [
    {
      messageId: 'b64b9ad9-cbd8-40a9-83f1-1419c3f4b9e2',
    },
  ];

  let test;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoMessagesSequence,
    };
    test = CerebralTest(presenter);

    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({
        userInboxCount: mockUserInboxCount,
        userSectionCount: mockUserSectionCount,
      });

    applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor.mockReturnValue(mockMessages);
  });

  it('should change the page to MyAccount and close the opened menu', async () => {
    await test.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    expect(test.getState()).toMatchObject({
      messages: mockMessages,
      messagesInboxCount: mockUserInboxCount,
      messagesSectionCount: mockUserSectionCount,
      notifications: {
        userInboxCount: mockUserInboxCount,
        userSectionCount: mockUserSectionCount,
      },
    });
  });
});
