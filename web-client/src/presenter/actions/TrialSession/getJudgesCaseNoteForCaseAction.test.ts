import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getJudgesCaseNoteForCaseAction } from './getJudgesCaseNoteForCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getJudgesCaseNoteForCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the trial details', async () => {
    applicationContext
      .getUseCases()
      .getUserCaseNoteInteractor.mockResolvedValue({
        note: '123',
      });

    const results = await runAction(getJudgesCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { docketNumber: '123' } },
    });

    const getUserCaseNoteInteractorCalls =
      applicationContext.getUseCases().getUserCaseNoteInteractor.mock.calls;

    expect(getUserCaseNoteInteractorCalls.length).toEqual(1);
    expect(getUserCaseNoteInteractorCalls[0][1].docketNumber).toEqual('123');

    expect(results.output).toEqual({
      userNote: {
        note: '123',
      },
    });
  });

  it('should use default user note if interactor throws an error', async () => {
    applicationContext
      .getUseCases()
      .getUserCaseNoteInteractor.mockImplementation(
        () => new Promise((_resolve, reject) => reject(null)),
      );

    const results = await runAction(getJudgesCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { docketNumber: '123' } },
    });

    const getUserCaseNoteInteractorCalls =
      applicationContext.getUseCases().getUserCaseNoteInteractor.mock.calls;

    expect(getUserCaseNoteInteractorCalls.length).toEqual(1);
    expect(getUserCaseNoteInteractorCalls[0][1].docketNumber).toEqual('123');

    expect(results.output).toEqual({
      userNote: {},
    });
  });
});
