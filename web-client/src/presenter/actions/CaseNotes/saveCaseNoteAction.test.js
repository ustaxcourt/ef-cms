import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { saveCaseNoteAction } from './saveCaseNoteAction';

const saveCaseNoteInteractorMock = jest.fn().mockReturnValue(true);
presenter.providers.applicationContext = {
  getUseCases: () => ({
    saveCaseNoteInteractor: saveCaseNoteInteractorMock,
  }),
};

describe('saveCaseNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('saves a procedural note on case with id from caseDetail.caseId', async () => {
    const caseId = '123-abc';
    const result = await runAction(saveCaseNoteAction, {
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
    expect(saveCaseNoteInteractorMock).toHaveBeenCalled();
    expect(saveCaseNoteInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId,
      caseNote: 'This is a procedural note',
    });
  });
});
