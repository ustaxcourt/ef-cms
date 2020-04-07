import { getJudgesCaseNoteForCaseAction } from './getJudgesCaseNoteForCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let getUserCaseNoteStub;

describe('getJudgesCaseNoteForCaseAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getUserCaseNoteInteractor: getUserCaseNoteStub,
      }),
    };
  });

  it('call the use case to get the trial details', async () => {
    getUserCaseNoteStub = jest.fn().mockResolvedValue({
      note: '123',
    });

    await runAction(getJudgesCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { caseId: '123' } },
    });
    expect(getUserCaseNoteStub.mock.calls.length).toEqual(1);
    expect(getUserCaseNoteStub.mock.calls[0][0].caseId).toEqual('123');
  });
});
