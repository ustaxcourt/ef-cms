import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getMessageThreadAction } from './getMessageThreadAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getMessageThreadAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('calls the use case with props.parentMessageId', async () => {
    await runAction(getMessageThreadAction, {
      modules: {
        presenter,
      },
      props: {
        parentMessageId: '0fbd6b64-6e13-4984-b46b-fd74906fd2c7',
      },
    });

    expect(
      applicationContextForClient.getUseCases().getMessageThreadInteractor,
    ).toBeCalled();
    expect(
      applicationContextForClient.getUseCases().getMessageThreadInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      parentMessageId: '0fbd6b64-6e13-4984-b46b-fd74906fd2c7',
    });
  });
});
