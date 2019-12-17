import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { saveProceduralNoteAction } from './saveProceduralNoteAction';

const saveProceduralNoteInteractorMock = jest.fn().mockReturnValue(true);
presenter.providers.applicationContext = {
  getUseCases: () => ({
    saveProceduralNoteInteractor: saveProceduralNoteInteractorMock,
  }),
};

describe('saveProceduralNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('saves a procedural note on case with id from caseDetail.caseId', async () => {
    const caseId = '123-abc';
    const result = await runAction(saveProceduralNoteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId,
        },
        modal: {
          notes: 'This is a procedural note',
        },
      },
    });
    expect(result).toBeDefined();
    expect(saveProceduralNoteInteractorMock).toHaveBeenCalled();
    expect(saveProceduralNoteInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId,
      proceduralNote: 'This is a procedural note',
    });
  });
});
