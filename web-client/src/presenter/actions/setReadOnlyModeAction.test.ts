import { runAction } from 'cerebral/test';
import { setReadOnlyModeAction } from './setReadOnlyModeAction';

describe('setReadOnlyModeAction', () => {
  it('should set state.readOnlyMode to the value of props.readOnlyMode', async () => {
    const result = await runAction(setReadOnlyModeAction, {
      props: {
        readOnlyMode: true,
      },
      state: {
        readOnlyMode: false,
      },
    });

    expect(result.state.readOnlyMode).toEqual(true);
  });
});
