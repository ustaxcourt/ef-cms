import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { completeMessageAction } from './completeMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('completeMessageAction', () => {
  beforeAll(() => {
    applicationContext.getUseCases().completeMessageInteractor.mockReturnValue({
      docketNumber: '123-45',
      parentMessageId: '123',
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call completeMessageInteractor with the expected messages', async () => {
    await runAction(completeMessageAction, {
      modules: {
        presenter,
      },
      props: {
        mostRecentMessage: {
          parentMessageId: '08c26c12-a3b0-40e6-abff-08152edeb053',
        },
      },
      state: {
        modal: {
          form: {
            message: 'the complete message',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().completeMessageInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().completeMessageInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      messages: [
        {
          messageBody: 'the complete message',
          parentMessageId: '08c26c12-a3b0-40e6-abff-08152edeb053',
        },
      ],
    });
  });
});
