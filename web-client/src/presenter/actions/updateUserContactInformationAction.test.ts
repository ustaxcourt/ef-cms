import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateUserContactInformationAction } from './updateUserContactInformationAction';

describe('updateUserContactInformationAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set userContactEditProgress.inProgress to true', async () => {
    const result = await runAction(updateUserContactInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: { address1: '999 Jump St' },
          firmName: 'testing',
        },
      },
    });
    expect(result.state.userContactEditProgress.inProgress).toBe(true);
  });

  it('should call the use case to update the user contact', async () => {
    await runAction(updateUserContactInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: { address1: '999 Jump St' },
          firmName: 'testing',
        },
      },
    });
    expect(
      applicationContext.getUseCases().updateUserContactInformationInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateUserContactInformationInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      contactInfo: {
        address1: '999 Jump St',
      },
      firmName: 'testing',
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
});
