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

  it('deletes a procedural note using caseDetail.caseId', async () => {
    const caseId = '123-abc';
    await runAction(deleteProceduralNoteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId,
        },
      },
    });
    expect(deleteProceduralNoteInteractorMock).toHaveBeenCalled();
  });
});
