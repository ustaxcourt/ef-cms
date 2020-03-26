import { extractUserNotesFromCalendaredCasesAction } from './extractUserNotesFromCalendaredCasesAction';
import { runAction } from 'cerebral/test';

describe('extractUserNotesFromCalendaredCasesAction', () => {
  it('extracts user notes from calendared cases', async () => {
    const result = await runAction(extractUserNotesFromCalendaredCasesAction, {
      state: {
        trialSession: {
          calendaredCases: [
            {
              caseId: '5e5af622-2d19-4c08-9e00-96a8253f634d',
              notes: {
                caseId: '5e5af622-2d19-4c08-9e00-96a8253f634d',
                notes: 'this is a note added',
                userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
              },
            },
            {
              caseId: '5e5af622-4c08-2d19-9e00-96a8253f634d',
              notes: {
                caseId: '5e5af622-4c08-2d19-9e00-96a8253f634d',
                notes: 'this is a note added',
                userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
              },
            },
          ],
        },
      },
    });

    expect(result.state.trialSessionWorkingCopy.userNotes).toMatchObject({
      '5e5af622-2d19-4c08-9e00-96a8253f634d': {
        caseId: '5e5af622-2d19-4c08-9e00-96a8253f634d',
        notes: 'this is a note added',
        userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
      },
      '5e5af622-4c08-2d19-9e00-96a8253f634d': {
        caseId: '5e5af622-4c08-2d19-9e00-96a8253f634d',
        notes: 'this is a note added',
        userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
      },
    });
  });
});
