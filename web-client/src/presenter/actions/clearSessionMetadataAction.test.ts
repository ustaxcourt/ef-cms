import { clearSessionMetadataAction } from './clearSessionMetadataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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
