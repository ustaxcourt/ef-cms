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
    applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor.mockReturnValue({ user: 'a judge' });
    const result = await runAction(getJudgeForCurrentUserAction, {
      modules: {
        presenter,
      },
    });
    expect(
      applicationContext.getUseCases().getJudgeForUserChambersInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({ judgeUser: { user: 'a judge' } });
  });

  it('return undefined if associated judge interactor returns undefined', async () => {
    applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor.mockReturnValue(undefined);
    const result = await runAction(getJudgeForCurrentUserAction, {
      modules: {
        presenter,
      },
    });
    expect(result.output).toBeUndefined();
  });
});
