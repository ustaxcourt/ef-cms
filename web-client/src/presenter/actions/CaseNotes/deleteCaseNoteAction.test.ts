import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { deleteCaseNoteAction } from './deleteCaseNoteAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
