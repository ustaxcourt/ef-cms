import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUsersInSectionAction } from './getUsersInSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getUsersInSectionAction', () => {
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
    await runAction(getUsersInSectionAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getUserInteractor,
    ).toHaveBeenCalled();
  });

  it('should return the retrieved user as props', async () => {
    const { output } = await runAction(getUsersInSectionAction, {
      modules: {
        presenter,
      },
    });

    expect(output).toEqual({ user: mockUser });
  });
});
