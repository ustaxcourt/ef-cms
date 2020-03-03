import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setTabToInProgressAction } from './setTabToInProgressAction';

describe('setTabToInProgressAction', () => {
  it('should update the props', async () => {
    const result = await runAction(setTabToInProgressAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output).toEqual({
      tab: 'inProgress',
    });
  });
});
