import { runAction } from '@web-client/presenter/test.cerebral';
import { setShowCaseNotesDefaultAction } from './setShowCaseNotesDefaultAction';

describe('setShowCaseNotesDefaultAction', () => {
  it('sets state.modal.showCaseNotes to true', async () => {
    const result = await runAction(setShowCaseNotesDefaultAction, {
      state: { modal: {} },
    });

    expect(result.state.modal.showCaseNotes).toBe(true);
  });
});
