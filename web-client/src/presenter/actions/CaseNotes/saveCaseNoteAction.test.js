import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveCaseNoteAction } from './saveCaseNoteAction';

presenter.providers.applicationContext = applicationContext;

describe('saveCaseNote', () => {
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
    expect(
      applicationContext.getUseCases().saveCaseNoteInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().saveCaseNoteInteractor.mock.calls[0][0],
    ).toMatchObject({
      caseId,
      caseNote: 'This is a procedural note',
    });
  });
});
