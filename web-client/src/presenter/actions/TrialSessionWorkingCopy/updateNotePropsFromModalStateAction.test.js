import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateNotePropsFromModalStateAction } from './updateNotePropsFromModalStateAction';

describe('updateNotePropsFromModalStateAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(updateNotePropsFromModalStateAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        modal: { caseId: '123', notes: 'down with opp' },
        trialSession: { trialSessionId: '456' },
      },
    });

    expect(result.output).toEqual({
      caseId: '123',
      notes: 'down with opp',
      trialSessionId: '456',
    });
  });
});
