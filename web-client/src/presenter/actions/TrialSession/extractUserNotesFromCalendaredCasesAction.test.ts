import { extractUserNotesFromCalendaredCasesAction } from './extractUserNotesFromCalendaredCasesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('extractUserNotesFromCalendaredCasesAction', () => {
  it('extracts user notes from calendared cases', async () => {
    const result = await runAction(extractUserNotesFromCalendaredCasesAction, {
      state: {
        trialSession: {
          calendaredCases: [
            {
              docketNumber: '123-45',
              notes: {
                docketNumber: '123-45',
                notes: 'this is a note added',
                userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
              },
            },
            {
              docketNumber: '678-90',
              notes: {
                docketNumber: '678-90',
                notes: 'this is a note added',
                userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
              },
            },
          ],
        },
      },
    });

    expect(result.state.trialSessionWorkingCopy.userNotes).toMatchObject({
      '123-45': {
        docketNumber: '123-45',
        notes: 'this is a note added',
        userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
      },
      '678-90': {
        docketNumber: '678-90',
        notes: 'this is a note added',
        userId: 'f0a1e52a-876f-4c03-853c-f66e407e5a1e',
      },
    });
  });
});
