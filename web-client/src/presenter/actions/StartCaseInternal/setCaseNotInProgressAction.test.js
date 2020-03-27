import { runAction } from 'cerebral/test';
import { setCaseNotInProgressAction } from './setCaseNotInProgressAction';

describe('setCaseNotInProgressAction', () => {
  it('sets the case to NOT in progress', async () => {
    const result = await runAction(setCaseNotInProgressAction);

    expect(result.state.form.inProgress).toEqual(false);
  });
});
