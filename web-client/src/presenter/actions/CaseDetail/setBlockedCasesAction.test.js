import { runAction } from 'cerebral/test';
import { setBlockedCasesAction } from './setBlockedCasesAction';

describe('setBlockedCasesAction', () => {
  it('should set the props.blockedCases on state.blockedCases', async () => {
    const result = await runAction(setBlockedCasesAction, {
      props: {
        blockedCases: [
          { blocked: true, caseId: '1', preferredTrialCity: 'Boise, Idaho' },
        ],
      },
      state: {},
    });

    expect(result.state.blockedCases).toEqual([
      { blocked: true, caseId: '1', preferredTrialCity: 'Boise, Idaho' },
    ]);
  });
});
