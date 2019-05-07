import { runAction } from 'cerebral/test';
import { unsetSaveSuccessAction } from './unsetSaveSuccessAction';

describe('unsetSaveSuccessAction', () => {
  it('should unset save success action', async () => {
    const result = await runAction(unsetSaveSuccessAction, {
      state: {
        screenMetadata: {
          showSaveSuccess: true,
        },
      },
    });

    expect(result.state.screenMetadata.showSaveSuccess).toEqual(true);
  });
});
