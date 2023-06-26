import { runAction } from '@web-client/presenter/test.cerebral';
import { setSessionMetadataValueAction } from './setSessionMetadataValueAction';

describe('setSessionMetadataValueAction', () => {
  it('should set the value of state.sessionMetadata at the key provided in props to the value provided in props', async () => {
    const { state } = await runAction(setSessionMetadataValueAction, {
      props: { key: 'backpack', value: 'blue' },
    });

    expect(state.sessionMetadata.backpack).toBe('blue');
  });
});
