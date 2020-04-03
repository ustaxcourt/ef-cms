import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCaseNoteAction } from './deleteCaseNoteAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('deleteCaseNote', () => {
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
    expect(
      applicationContext.getUseCases().deleteCaseNoteInteractor,
    ).toHaveBeenCalled();
  });
});
