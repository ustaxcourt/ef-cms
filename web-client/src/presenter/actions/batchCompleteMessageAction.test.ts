import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { batchCompleteMessageAction } from '@web-client/presenter/actions/batchCompleteMessageAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('batchCompleteMessageAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .completeMessageInteractor.mockResolvedValue();
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call completeMessageInteractor with the correct ids when there are selected messages', async () => {
    const selectedMessages = new Map([
      ['id1', 'parentId1'],
      ['id2', 'parentId2'],
    ]);

    await runAction(batchCompleteMessageAction, {
      modules: { presenter },
      state: {
        messagesPage: {
          selectedMessages,
        },
      },
    });

    expect(
      applicationContext.getUseCases().completeMessageInteractor.mock
        .calls[0][1],
    ).toEqual({
      messages: [
        { messageBody: '', parentMessageId: 'parentId1' },
        { messageBody: '', parentMessageId: 'parentId2' },
      ],
    });
  });

  it('should call completeMessageInteractor with an empty array when there are no selected messages', async () => {
    const selectedMessages = new Map();

    await runAction(batchCompleteMessageAction, {
      modules: { presenter },
      state: {
        messagesPage: {
          selectedMessages,
        },
      },
    });

    expect(
      applicationContext.getUseCases().completeMessageInteractor.mock
        .calls[0][1],
    ).toEqual({
      messages: [],
    });
  });
});
