import { getUserByIdAction } from './getUserByIdAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('getUserByIdAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContextForClient;
    applicationContextForClient
      .getUseCases()
      .getUserByIdInteractor.mockReturnValue({
        role: 'privatePractitioner',
        userId: '123',
      });
  });

  it('should call the user and return the user from the use case', async () => {
    const results = await runAction(getUserByIdAction, {
      modules: {
        presenter,
      },
      props: {
        userId: '123',
      },
    });

    expect(results.output.user).toEqual({
      role: 'privatePractitioner',
      userId: '123',
    });
  });
});
