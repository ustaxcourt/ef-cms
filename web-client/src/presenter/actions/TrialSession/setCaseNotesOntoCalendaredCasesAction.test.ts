import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseNotesOntoCalendaredCasesAction } from './setCaseNotesOntoCalendaredCasesAction';

describe('setCaseNotesOntoCalendaredCasesAction', () => {
  it('should merge case order into associated eligible cases', async () => {
    const result = await runAction(setCaseNotesOntoCalendaredCasesAction, {
      props: {
        notes: [
          {
            docketNumber: '123-45',
            note: 'welcome to flavortown',
            userId: 'user-id-123',
          },
        ],
      },
      state: {
        trialSession: {
          calendaredCases: [{ docketNumber: '123-45' }],
        },
      },
    });

    expect(result.state.trialSession.calendaredCases).toMatchObject([
      {
        docketNumber: '123-45',
        notes: {
          docketNumber: '123-45',
          note: 'welcome to flavortown',
          userId: 'user-id-123',
        },
      },
    ]);
  });
});
