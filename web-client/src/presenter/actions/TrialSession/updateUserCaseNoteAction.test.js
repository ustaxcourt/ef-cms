import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().updateUserCaseNoteInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-45',
      notes: 'welcome to flavortown',
    });
  });
});
