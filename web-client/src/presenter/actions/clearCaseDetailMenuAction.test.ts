import { clearCaseDetailMenuAction } from './clearCaseDetailMenuAction';
import { runAction } from 'cerebral/test';

describe('clearCaseDetailMenuAction', () => {
  it('clears state.navigation.caseDetailMenu', async () => {
    const result = await runAction(clearCaseDetailMenuAction, {
      state: {
        form: {
          navigation: {
            caseDetailMenu: 'wow',
          },
        },
      },
    });

    expect(result.state.navigation.caseDetailMenu).toBeUndefined();
  });
});
