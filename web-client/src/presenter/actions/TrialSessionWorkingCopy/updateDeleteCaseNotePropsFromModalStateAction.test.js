import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDeleteCaseNotePropsFromModalStateAction } from './updateDeleteCaseNotePropsFromModalStateAction';

describe('updateDeleteCaseNotePropsFromModalStateAction', () => {
  it('should set the modal docketNumber state', async () => {
    const result = await runAction(
      updateDeleteCaseNotePropsFromModalStateAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          modal: { caseId: '123' },
          trialSession: { trialSessionId: '456' },
        },
      },
    );

    expect(result.output).toEqual({
      caseId: '123',
      trialSessionId: '456',
    });
  });
});
