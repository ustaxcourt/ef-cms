import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getBulkSpecialTrialSessionCopyNotesAction } from './getBulkSpecialTrialSessionCopyNotesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getBulkSpecialTrialSessionCopyNotesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getBulkSpecialTrialSessionCopyNotesInteractor.mockResolvedValue([
        {
          sessionNotes: 'notes',
          trialSessionId: '123',
        },
      ]);
  });

  it('call the use case to get the bulk special trial session copy notes', async () => {
    await runAction(getBulkSpecialTrialSessionCopyNotesAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessions: [
          {
            judge: {
              userId: 'abc',
            },
            sessionType: 'Special',
            trialSessionId: '123',
          },
        ],
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases()
        .getBulkSpecialTrialSessionCopyNotesInteractor,
    ).toHaveBeenCalled();
  });
});
