import { deleteProceduralNoteAction } from './deleteProceduralNoteAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const deleteProceduralNoteInteractorMock = jest.fn();
presenter.providers.applicationContext = {
  getUseCases: () => ({
    deleteProceduralNoteInteractor: deleteProceduralNoteInteractorMock,
  }),
};

describe('deleteProceduralNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('deletes a procedural note from a case when provided with a caseId', async () => {
    const caseId = '123-abc';
    const result = await runAction(deleteProceduralNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseId,
        },
      },
    });
    expect(deleteProceduralNoteInteractorMock).toHaveBeenCalled();
  });
});
