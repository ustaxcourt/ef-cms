import { deleteCaseNoteAction } from './deleteCaseNoteAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const deleteCaseNoteInteractorMock = jest.fn();
presenter.providers.applicationContext = {
  getUseCases: () => ({
    deleteCaseNoteInteractor: deleteCaseNoteInteractorMock,
  }),
};

describe('deleteCaseNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deletes a procedural note using caseDetail.caseId', async () => {
    const caseId = '123-abc';
    await runAction(deleteCaseNoteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId,
        },
      },
    });
    expect(deleteCaseNoteInteractorMock).toHaveBeenCalled();
  });
});
