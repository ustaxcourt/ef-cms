import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getUserAction } from './getUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getUserAction', () => {
  const mockUser = {
    barNumber: 'BN1234',
    name: 'Private Practitioner',
    role: 'privatePractitioner',
    section: 'privatePractitioner',
    userId: '330d4b65-620a-489d-8414-6623653ebc4f',
  };

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getUserInteractor.mockReturnValue(mockUser);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to getUserInteractor', async () => {
    await runAction(getUserAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getUserInteractor,
    ).toHaveBeenCalled();
  });

  it('should return the retrieved user as props', async () => {
    const { output } = await runAction(getUserAction, {
      modules: {
        presenter,
      },
    });

    expect(output).toEqual({ user: mockUser });
  });
});
