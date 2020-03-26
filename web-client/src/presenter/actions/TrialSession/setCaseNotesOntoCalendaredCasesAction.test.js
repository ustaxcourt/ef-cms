import { runAction } from 'cerebral/test';
import { setCaseNotesOntoCalendaredCasesAction } from './setCaseNotesOntoCalendaredCasesAction';

describe('setCaseNotesOntoCalendaredCasesAction', () => {
  it('should merge case order into associated eligible cases', async () => {
    const result = await runAction(setCaseNotesOntoCalendaredCasesAction, {
      props: {
        notes: [
          {
            caseId: 'case-id-123',
            note: 'welcome to flavortown',
            userId: 'user-id-123',
          },
        ],
      },
      state: {
        trialSession: {
          calendaredCases: [{ caseId: 'case-id-123' }],
        },
      },
    });

    expect(result.state.trialSession.calendaredCases).toMatchObject([
      {
        caseId: 'case-id-123',
        notes: {
          caseId: 'case-id-123',
          note: 'welcome to flavortown',
          userId: 'user-id-123',
        },
      },
    ]);
  });
});
