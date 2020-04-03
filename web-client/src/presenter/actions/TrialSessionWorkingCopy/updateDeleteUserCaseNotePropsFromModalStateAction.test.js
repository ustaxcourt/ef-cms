import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateDeleteUserCaseNotePropsFromModalStateAction } from './updateDeleteUserCaseNotePropsFromModalStateAction';

describe('updateDeleteUserCaseNotePropsFromModalStateAction', () => {
  it('should set the modal docketNumber state', async () => {
    const result = await runAction(
      updateDeleteUserCaseNotePropsFromModalStateAction,
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
