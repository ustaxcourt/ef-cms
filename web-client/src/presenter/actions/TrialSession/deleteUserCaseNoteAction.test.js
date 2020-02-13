import { deleteUserCaseNoteAction } from './deleteUserCaseNoteAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('deleteUserCaseNoteAction', () => {
  let deleteUserCaseNoteInteractorStub;

  beforeEach(() => {
    deleteUserCaseNoteInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        deleteUserCaseNoteInteractor: deleteUserCaseNoteInteractorStub,
      }),
    };
  });

  it('deletes a case note', async () => {
    const result = await runAction(deleteUserCaseNoteAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: 'case-id-123',
        trialSessionId: 'trial-session-id-123',
      },
    });

    expect(result.output).toMatchObject({
      userNote: {
        caseId: 'case-id-123',
        trialSessionId: 'trial-session-id-123',
      },
    });
    expect(deleteUserCaseNoteInteractorStub).toHaveBeenCalled();
  });
});
