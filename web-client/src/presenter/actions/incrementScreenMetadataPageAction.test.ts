import { incrementScreenMetadataPageAction } from './incrementScreenMetadataPageAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementScreenMetadataPageAction', () => {
  it('increments the value of screenMetadata.page by one and sets it on state', async () => {
    const result = await runAction(incrementScreenMetadataPageAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          page: 1,
        },
      },
    });

    expect(result.state.screenMetadata.page).toEqual(2);
  });

  it('defaults the value of screenMetadata.page to one if not set', async () => {
    const result = await runAction(incrementScreenMetadataPageAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.page).toEqual(2);
  });
});
