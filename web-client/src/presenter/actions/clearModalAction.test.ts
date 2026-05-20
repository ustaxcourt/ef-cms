import { clearModalAction } from './clearModalAction';
import { X_MANUAL_REFRESH_REQUIRED } from '@shared/utils/headers';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearModalAction', () => {
  it('should unset the value of state.modal.showModal', async () => {
    const result = await runAction(clearModalAction, {
      state: {
        modal: {
          showModal: true,
        },
      },
    });

    expect(result.state.modal.showModal).toBeUndefined();
  });

  it('should leave the modal open when a manual refresh is required', async () => {
    const result = await runAction(clearModalAction, {
      props: {
        error: {
          originalError: {
            response: {
              headers: {
                [X_MANUAL_REFRESH_REQUIRED]: 'true',
              },
            },
          },
        },
      },
      state: {
        modal: {
          showModal: true,
        },
      },
    });

    expect(result.state.modal.showModal).toBeTruthy();
  });
});
