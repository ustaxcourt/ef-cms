import { runAction } from '@web-client/presenter/test.cerebral';
import { setBlockedCasesAction } from './setBlockedCasesAction';

describe('setBlockedCasesAction', () => {
  it('should set the props.blockedCases on state.blockedCases', async () => {
    const result = await runAction(setBlockedCasesAction, {
      props: {
        blockedCases: [
          {
            blocked: true,
            docketNumber: '123-45',
            preferredTrialCity: 'Boise, Idaho',
          },
        ],
      },
      state: {},
    });

    expect(result.state.blockedCases).toEqual([
      {
        blocked: true,
        docketNumber: '123-45',
        preferredTrialCity: 'Boise, Idaho',
      },
    ]);
  });
});
