import { deleteJudgesCaseNoteAction } from './deleteJudgesCaseNoteAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('deleteJudgesCaseNoteAction', () => {
  let deleteJudgesCaseNoteInteractorStub;

  beforeEach(() => {
    deleteJudgesCaseNoteInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        deleteJudgesCaseNoteInteractor: deleteJudgesCaseNoteInteractorStub,
      }),
    };
  });

  it('deletes a case note', async () => {
    const result = await runAction(deleteJudgesCaseNoteAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: 'case-id-123',
        trialSessionId: 'trial-session-id-123',
      },
    });

    expect(result.output).toMatchObject({
      judgesNote: {
        caseId: 'case-id-123',
        trialSessionId: 'trial-session-id-123',
      },
    });
    expect(deleteJudgesCaseNoteInteractorStub).toHaveBeenCalled();
  });
});
