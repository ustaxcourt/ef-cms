import { expireSaveSuccessAction } from './expireSaveSuccessAction';
import { runAction } from 'cerebral/test';

describe('expireSaveSuccessAction', () => {
  it('should unset save success action after a few seconds', async () => {
    const result = await runAction(expireSaveSuccessAction, {
      state: {
        screenMetadata: {
          showSaveSuccess: true,
        },
      },
    });
    // because code within action has a setTimeout, value remains the same
    expect(result.state.screenMetadata.showSaveSuccess).toEqual(true);

    // wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    expect(result.state.screenMetadata.showSaveSuccess).toEqual(false);
  });
});
