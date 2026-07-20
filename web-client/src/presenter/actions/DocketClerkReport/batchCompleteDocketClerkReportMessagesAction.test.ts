import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { batchCompleteDocketClerkReportMessagesAction } from './batchCompleteDocketClerkReportMessagesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('batchCompleteDocketClerkReportMessagesAction', () => {
  const mockClerk = {
    name: 'Alice Jones',
    role: 'docketClerk',
    section: 'docket',
    userId: 'clerk-uuid-002',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .completeMessageInteractor.mockResolvedValue(undefined);
  });

  const runWith = ({
    selectedClerk = mockClerk,
    selectedMessages,
  }: {
    selectedClerk?: any;
    selectedMessages: Map<string, string>;
  }) =>
    runAction(batchCompleteDocketClerkReportMessagesAction, {
      modules: { presenter },
      state: {
        docketClerkReport: { selectedClerk },
        messagesPage: { selectedMessages },
      },
    });

  it('should attribute the completion to the selected clerk rather than the logged-in user', async () => {
    await runWith({
      selectedMessages: new Map([['message-1', 'parent-1']]),
    });

    expect(
      applicationContext.getUseCases().completeMessageInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ completedByUserId: 'clerk-uuid-002' }),
    );
  });

  it('should complete every selected message by its parentMessageId', async () => {
    await runWith({
      selectedMessages: new Map([
        ['message-1', 'parent-1'],
        ['message-2', 'parent-2'],
      ]),
    });

    expect(
      applicationContext.getUseCases().completeMessageInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        messages: [
          { messageBody: '', parentMessageId: 'parent-1' },
          { messageBody: '', parentMessageId: 'parent-2' },
        ],
      }),
    );
  });

  it('should send an undefined completedByUserId when no clerk is selected', async () => {
    await runWith({
      selectedClerk: null,
      selectedMessages: new Map([['message-1', 'parent-1']]),
    });

    expect(
      applicationContext.getUseCases().completeMessageInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ completedByUserId: undefined }),
    );
  });

  it('should call the interactor with no messages when nothing is selected', async () => {
    await runWith({ selectedMessages: new Map() });

    expect(
      applicationContext.getUseCases().completeMessageInteractor,
    ).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ messages: [] }),
    );
  });
});
