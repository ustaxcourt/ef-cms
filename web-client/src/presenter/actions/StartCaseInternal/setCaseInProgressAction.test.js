import { runAction } from 'cerebral/test';
import { setCaseInProgressAction } from './setCaseInProgressAction';

describe('setCaseInProgressAction', () => {
  it('sets the case to in progress', async () => {
    const result = await runAction(setCaseInProgressAction);

    expect(result.state.form.inProgress).toEqual(true);
  });
});
