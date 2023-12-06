import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseNoteOnCaseDetailAction } from './setCaseNoteOnCaseDetailAction';

describe('setCaseNoteOnCaseDetailAction', () => {
  it('should set state.caseDetail.caseNote from the provided props.caseDetail.caseNote', async () => {
    const mockCaseNote = 'This is a case note from a test.';

    const { state } = await runAction(setCaseNoteOnCaseDetailAction, {
      props: {
        caseDetail: {
          caseNote: mockCaseNote,
        },
      },
      state: {
        caseDetail: {
          caseNote: undefined,
        },
      },
    });

    expect(state.caseDetail.caseNote).toBe(mockCaseNote);
  });
});
