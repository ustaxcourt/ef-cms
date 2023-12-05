import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateUserCaseNoteAction } from './updateUserCaseNoteAction';

describe('updateUserCaseNoteAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('update user case note', async () => {
    await runAction(updateUserCaseNoteAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-45',
        notes: 'welcome to flavortown',
      },
    });

    expect(
      applicationContext.getUseCases().updateUserCaseNoteInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateUserCaseNoteInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-45',
      notes: 'welcome to flavortown',
    });
  });
});
