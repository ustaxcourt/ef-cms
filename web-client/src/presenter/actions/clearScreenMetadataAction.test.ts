import { clearScreenMetadataAction } from './clearScreenMetadataAction';
import { runAction } from 'cerebral/test';

describe('clearScreenMetadataAction', () => {
  it('should clear the value of state.screenMetadata', async () => {
    const result = await runAction(clearScreenMetadataAction, {
      state: {
        screenMetadata: {
          property1: true,
          property2: false,
        },
      },
    });

    expect(result.state.screenMetadata).toEqual({});
  });
});
