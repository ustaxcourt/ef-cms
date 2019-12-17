import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { saveProceduralNoteAction } from './saveProceduralNoteAction';

const saveProceduralNoteInteractorMock = jest.fn();
presenter.providers.applicationContext = {
  getUseCases: () => ({
    saveProceduralNoteInteractor: saveProceduralNoteInteractorMock,
  }),
};

describe('saveProceduralNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('saves a procedural note on a case when provided with a caseId', async () => {
    const caseId = '123-abc';
    await runAction(saveProceduralNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseId,
          proceduralNote: 'This is a procedural note',
        },
      },
    });
    expect(saveProceduralNoteInteractorMock).toHaveBeenCalled();
  });
});
