import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteAuthCookieAction } from './deleteAuthCookieAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
