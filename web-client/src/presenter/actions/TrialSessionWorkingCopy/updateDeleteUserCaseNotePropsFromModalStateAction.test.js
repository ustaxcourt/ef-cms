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
          modal: { docketNumber: '123-45' },
          trialSession: { trialSessionId: '456' },
        },
      },
    );

    expect(result.output).toEqual({
      docketNumber: '123-45',
      trialSessionId: '456',
    });
  });
});
