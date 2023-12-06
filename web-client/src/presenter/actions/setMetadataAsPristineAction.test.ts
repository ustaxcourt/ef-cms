import { runAction } from '@web-client/presenter/test.cerebral';
import { setMetadataAsPristineAction } from './setMetadataAsPristineAction';

describe('setMetadataAsPristineAction', () => {
  it('sets the state.screenMetadata.pristine to true', async () => {
    const { state } = await runAction(setMetadataAsPristineAction, {
      state: {},
    });
    expect(state.screenMetadata.pristine).toBeTruthy();
  });
});
