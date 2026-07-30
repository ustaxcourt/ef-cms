import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runDocketClerkReportSequence } from './runDocketClerkReportSequence';

describe('runDocketClerkReportSequence', () => {
  const mockClerk = {
    name: 'Alice Jones',
    role: 'docketClerk',
    section: 'docket',
    userId: 'clerk-uuid-001',
  };

  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      runDocketClerkReportSequence,
    };
    cerebralTest = CerebralTest(presenter);

    applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor.mockResolvedValue([]);
    applicationContext
      .getUseCases()
      .getOutboxMessagesForUserInteractor.mockResolvedValue([]);
    applicationContext
      .getUseCases()
      .getCompletedMessagesForUserInteractor.mockResolvedValue([]);
  });

  it('should clear stale selectedMessages when the report is run', async () => {
    cerebralTest.setState('docketClerkReport', {
      docketClerks: [mockClerk],
      form: {
        docketClerkUserId: mockClerk.userId,
        pageType: 'messages',
      },
    });

    cerebralTest.setState(
      'messagesPage.selectedMessages',
      new Map([
        ['msg-id-1', 'parent-id-1'],
        ['msg-id-2', 'parent-id-2'],
      ]),
    );

    await cerebralTest.runSequence('runDocketClerkReportSequence');

    expect(cerebralTest.getState('messagesPage.selectedMessages').size).toEqual(
      0,
    );
  });
});
