import { getUserByIdAction } from './getUserByIdAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getUserByIdInteractor: () => ({
      role: 'privatePractitioner',
      userId: '123',
    }),
  }),
};

describe('getUserByIdAction', () => {
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
