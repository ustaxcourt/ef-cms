import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocketClerkReportMessagesAction } from './getDocketClerkReportMessagesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocketClerkReportMessagesAction', () => {
  const mockClerk = {
    name: 'Alice Jones',
    role: 'docketClerk',
    section: 'docket',
    userId: 'clerk-uuid-002',
  };

  const mockInboxMessages = [{ messageId: 'i1' }];
  const mockSentMessages = [{ messageId: 's1' }, { messageId: 's2' }];
  const mockCompletedMessages = [{ messageId: 'c1' }];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor.mockResolvedValue(mockInboxMessages);
    applicationContext
      .getUseCases()
      .getOutboxMessagesForUserInteractor.mockResolvedValue(mockSentMessages);
    applicationContext
      .getUseCases()
      .getCompletedMessagesForUserInteractor.mockResolvedValue(
        mockCompletedMessages,
      );
  });

  it('should call getInboxMessagesForUserInteractor with selectedClerk userId', async () => {
    await runAction(getDocketClerkReportMessagesAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          completedMessages: [],
          inboxMessages: [],
          selectedClerk: mockClerk,
          sentMessages: [],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getInboxMessagesForUserInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ userId: 'clerk-uuid-002' }),
    );
  });

  it('should call getOutboxMessagesForUserInteractor with selectedClerk userId', async () => {
    await runAction(getDocketClerkReportMessagesAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          completedMessages: [],
          inboxMessages: [],
          selectedClerk: mockClerk,
          sentMessages: [],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getOutboxMessagesForUserInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ userId: 'clerk-uuid-002' }),
    );
  });

  it('should call getCompletedMessagesForUserInteractor with selectedClerk userId and filterByInbox: true', async () => {
    await runAction(getDocketClerkReportMessagesAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          completedMessages: [],
          inboxMessages: [],
          selectedClerk: mockClerk,
          sentMessages: [],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCompletedMessagesForUserInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        filterByInbox: true,
        userId: 'clerk-uuid-002',
      }),
    );
  });

  it('should store all three message arrays in state', async () => {
    const { state } = await runAction(getDocketClerkReportMessagesAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          completedMessages: [],
          inboxMessages: [],
          selectedClerk: mockClerk,
          sentMessages: [],
        },
      },
    });

    expect(state.docketClerkReport.inboxMessages).toEqual(mockInboxMessages);
    expect(state.docketClerkReport.sentMessages).toEqual(mockSentMessages);
    expect(state.docketClerkReport.completedMessages).toEqual(
      mockCompletedMessages,
    );
  });

  it('should not call any use case when selectedClerk is null', async () => {
    jest.clearAllMocks();

    await runAction(getDocketClerkReportMessagesAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          completedMessages: [],
          inboxMessages: [],
          selectedClerk: null,
          sentMessages: [],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getInboxMessagesForUserInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getOutboxMessagesForUserInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getCompletedMessagesForUserInteractor,
    ).not.toHaveBeenCalled();
  });
});
