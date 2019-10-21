import { deleteCaseNoteAction } from './deleteCaseNoteAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('deleteCaseNoteAction', () => {
  let deleteCaseNoteInteractorStub;

  beforeEach(() => {
    deleteCaseNoteInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        deleteCaseNoteInteractor: deleteCaseNoteInteractorStub,
      }),
    };
  });

  it('deletes a case note', async () => {
    const result = await runAction(deleteCaseNoteAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: 'case-id-123',
        trialSessionId: 'trial-session-id-123',
      },
    });

    expect(result.output).toMatchObject({
      caseNote: {
        caseId: 'case-id-123',
        trialSessionId: 'trial-session-id-123',
      },
    });
    expect(deleteCaseNoteInteractorStub).toHaveBeenCalled();
  });
});
