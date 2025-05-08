import { setRemovePetitionerEmailAction } from '@web-client/presenter/actions/setRemovePetitionerEmailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('setRemovePetitionerEmailAction', () => {
  it('should set email to remove', async () => {
    const result = await runAction(setRemovePetitionerEmailAction, {
      props: {
        email: 'test@example.com',
      },
      state: {
        modal: { petitionerEmailToRemove: undefined },
      },
    });

    expect(result.state.modal.petitionerEmailToRemove).toEqual(
      'test@example.com',
    );
  });
});
