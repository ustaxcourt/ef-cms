import { runAction } from '@web-client/presenter/test.cerebral';
import { showPractitionerEmailInputAction } from './showPractitionerEmailInputAction';

describe('showPractitionerEmailInputAction', () => {
  it('sets state.screenMetadata.showPractitionerEmailInput to true', async () => {
    const result = await runAction(showPractitionerEmailInputAction, {
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.showPractitionerEmailInput).toEqual(
      true,
    );
  });
});
