import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCaseNoteAction } from './deleteCaseNoteAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('deleteCaseNote', () => {
  presenter.providers.applicationContext = applicationContext;

  it('deletes a procedural note using caseDetail.docketNumber', async () => {
    const docketNumber = '123-abc';

    await runAction(deleteCaseNoteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().deleteCaseNoteInteractor,
    ).toHaveBeenCalled();
  });
});
