import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getUserCaseNoteForCasesAction } from './getUserCaseNoteForCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getUserCaseNoteForCasesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the user case note for cases', async () => {
    applicationContext
      .getUseCases()
      .getUserCaseNoteForCasesInteractor.mockResolvedValue([
        {
          docketNumber: '123-45',
          note: 'welcome to flavortown',
          userId: 'user-id-123',
        },
        {
          docketNumber: '678-90',
          note: 'hi there face here',
          userId: 'user-id-234',
        },
      ]);

    await runAction(getUserCaseNoteForCasesAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          caseOrder: [{ docketNumber: '123-45' }, { docketNumber: '678-90' }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUserCaseNoteForCasesInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getUserCaseNoteForCasesInteractor.mock
        .calls[0][1].docketNumbers,
    ).toEqual(['123-45', '678-90']);
  });
});
