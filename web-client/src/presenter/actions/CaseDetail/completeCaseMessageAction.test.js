import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeCaseMessageAction } from './completeCaseMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeCaseMessageAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .completeCaseMessageInteractor.mockReturnValue({
        docketNumber: '123-45',
        parentMessageId: '123',
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call completeCaseMessageInteractor with the expected parameters and return the alertSuccess and parentMessageId', async () => {
    const result = await runAction(completeCaseMessageAction, {
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
      applicationContext.getUseCases().completeCaseMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().completeCaseMessageInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      message: 'the complete message',
      parentMessageId: '08c26c12-a3b0-40e6-abff-08152edeb053',
    });
    expect(result.output).toHaveProperty('parentMessageId');
  });
});
