import { getJudgeForCurrentUserAction } from './getJudgeForCurrentUserAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('getJudgeForCurrentUserAction', () => {
  let getJudgeForUserChambersInteractor;
  beforeEach(() => {
    const applicationContext = applicationContextForClient;
    presenter.providers.applicationContext = applicationContext;
    getJudgeForUserChambersInteractor = applicationContext.getUseCases()
      .getJudgeForUserChambersInteractor;
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '123',
    });
  });

  it('Should call the interactor for fetching the associated judge for the judge or chambers user', async () => {
    await runAction(getJudgeForCurrentUserAction, {
      modules: {
        presenter,
      },
    });
    expect(getJudgeForUserChambersInteractor).toHaveBeenCalled();
  });
});
