import { runAction } from 'cerebral/test';
import { setCaseNotesFlagDefaultAction } from './setCaseNotesFlagDefaultAction';

describe('setCaseNotesFlagDefaultAction', () => {
  it('sets state.modal.caseNotesFlag to true', async () => {
    const result = await runAction(setCaseNotesFlagDefaultAction, {
      state: { modal: {} },
    });

    expect(result.state.modal.caseNotesFlag).toBe(true);
  });
});
