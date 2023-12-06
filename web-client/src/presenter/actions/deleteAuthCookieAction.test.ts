import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { deleteAuthCookieAction } from './deleteAuthCookieAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('deleteAuthCookieAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases();
  });

  it('should call the delete auth cookie interactor', async () => {
    await runAction(deleteAuthCookieAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().deleteAuthCookieInteractor,
    ).toHaveBeenCalled();
  });
});
