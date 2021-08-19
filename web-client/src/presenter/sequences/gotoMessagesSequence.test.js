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

  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoMessagesSequence,
    };
    cerebralTest = CerebralTest(presenter);

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
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    expect(cerebralTest.getState()).toMatchObject({
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
