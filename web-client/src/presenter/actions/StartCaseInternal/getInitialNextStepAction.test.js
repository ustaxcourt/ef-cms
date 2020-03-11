import { getInitialNextStepAction } from './getInitialNextStepAction';
import { runAction } from 'cerebral/test';

describe('getInitialNextStepAction', () => {
  it('should return nextStep prop', async () => {
    const result = await runAction(getInitialNextStepAction, {});
    expect(result.output.nextStep).toBeTruthy();
  });
});
