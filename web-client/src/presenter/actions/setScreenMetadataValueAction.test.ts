import { runAction } from '@web-client/presenter/test.cerebral';
import { setScreenMetadataValueAction } from './setScreenMetadataValueAction';

describe('setScreenMetadataValueAction', () => {
  it('should set the value of state.screenMetadata at the key provided in props to the value provided in props', async () => {
    const { state } = await runAction(setScreenMetadataValueAction, {
      props: { key: 'bird', value: 'blue' },
    });

    expect(state.screenMetadata.bird).toBe('blue');
  });
});
