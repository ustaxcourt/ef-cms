import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { unsetUserCaseNoteFromTrialSessionWorkingCopyAction } from './unsetUserCaseNoteFromTrialSessionWorkingCopyAction';

describe('unsetUserCaseNoteFromTrialSessionWorkingCopyAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(
      unsetUserCaseNoteFromTrialSessionWorkingCopyAction,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: '123',
        },
        state: {
          trialSessionWorkingCopy: {
            caseMetadata: {
              '123': {
                notes: 'here are some notes',
              },
            },
          },
        },
      },
    );

    expect(result.state.trialSessionWorkingCopy.caseMetadata['123']).toEqual(
      {},
    );
  });
});
