import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeMessageAction } from './completeMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeMessageAction', () => {
  beforeAll(() => {
    applicationContext.getUseCases().completeMessageInteractor.mockReturnValue({
      docketNumber: '123-45',
      parentMessageId: '123',
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call completeMessageInteractor with the expected parameters and return the alertSuccess and parentMessageId', async () => {
    const result = await runAction(completeMessageAction, {
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
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().completeMessageInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      message: 'the complete message',
      parentMessageId: '08c26c12-a3b0-40e6-abff-08152edeb053',
    });
    expect(result.output).toHaveProperty('parentMessageId');
  });
});
