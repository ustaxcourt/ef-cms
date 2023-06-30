import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCalendaredCaseUserNoteAction } from './updateCalendaredCaseUserNoteAction';

describe('updateCalendaredCaseUserNoteAction', () => {
  const mockDocketNumber = '121-21';
  const mockNote = 'This is a secret note';

  it('should set state.trialSessionWorkingCopy.userNotes', async () => {
    const { state } = await runAction(updateCalendaredCaseUserNoteAction, {
      props: {
        userNote: {
          docketNumber: mockDocketNumber,
          note: mockNote,
        },
      },
      state: {
        trialSession: {
          calendaredCases: [
            {
              ...MOCK_CASE,
              docketNumber: mockDocketNumber,
            },
          ],
        },
      },
    });

    expect(state.trialSessionWorkingCopy.userNotes).toEqual({
      '121-21': {
        docketNumber: mockDocketNumber,
        note: mockNote,
      },
    });
  });
});
