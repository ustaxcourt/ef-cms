import { clearSessionMetadataAction } from './clearSessionMetadataAction';
import { runAction } from 'cerebral/test';

describe('clearSessionMetadataAction', () => {
  it('should clear the value of state.sessionMetadata', async () => {
    const result = await runAction(clearSessionMetadataAction, {
      state: {
        sessionMetadata: {
          someProperty: 'test',
        },
      },
    });

    expect(result.state.sessionMetadata).toEqual({});
  });
});
