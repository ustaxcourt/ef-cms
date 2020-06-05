import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getMessageAction } from './getMessageAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getMessageAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('calls the use case with props.messageId', async () => {
    await runAction(getMessageAction, {
      modules: {
        presenter,
      },
      props: {
        messageId: '0fbd6b64-6e13-4984-b46b-fd74906fd2c7',
      },
    });

    expect(
      applicationContextForClient.getUseCases().getCaseMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUseCases().getCaseMessageInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      messageId: '0fbd6b64-6e13-4984-b46b-fd74906fd2c7',
    });
  });
});
