import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveCaseNoteAction } from './saveCaseNoteAction';

describe('saveCaseNote', () => {
  presenter.providers.applicationContext = applicationContext;

  it('saves a procedural note on case with id from caseDetail.docketNumber', async () => {
    const docketNumber = '123-abc';

    const result = await runAction(saveCaseNoteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber,
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
      applicationContext.getUseCases().saveCaseNoteInteractor.mock.calls[0][1],
    ).toMatchObject({
      caseNote: 'This is a procedural note',
      docketNumber,
    });
  });
});
