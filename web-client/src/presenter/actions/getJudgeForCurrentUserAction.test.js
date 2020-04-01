import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgeForCurrentUserAction } from './getJudgeForCurrentUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getJudgeForCurrentUserAction', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '123',
    });
    presenter.providers.applicationContext = applicationContext;
  });

  it('Should call the interactor for fetching the associated judge for the judge or chambers user', async () => {
    await runAction(getJudgeForCurrentUserAction, {
      modules: {
        presenter,
      },
    });
    expect(
      applicationContext.getUseCases().getJudgeForUserChambersInteractor,
    ).toHaveBeenCalled();
  });
});
