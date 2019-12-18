import { getJudgeForCurrentUserAction } from './getJudgeForCurrentUserAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const getJudgeForUserChambersInteractorMock = jest.fn();
presenter.providers.applicationContext = {
  getCurrentUser: () => ({
    userId: '123',
  }),
  getUseCases: () => ({
    getJudgeForUserChambersInteractor: getJudgeForUserChambersInteractorMock,
  }),
};

describe('getJudgeForCurrentUserAction', () => {
  it('Should call the interactor for fetching the associated judge for the judge or chambers user', async () => {
    await runAction(getJudgeForCurrentUserAction, {
      modules: {
        presenter,
      },
    });
    expect(getJudgeForUserChambersInteractorMock).toHaveBeenCalled();
  });
});
