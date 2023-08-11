import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCorrespondenceToDeleteAction } from './setCorrespondenceToDeleteAction';

describe('setCorrespondenceToDeleteAction', () => {
  it('should set state.modal.correspondenceToDelete documentTitle and correspondenceId', async () => {
    const result = await runAction(setCorrespondenceToDeleteAction, {
      modules: {
        presenter,
      },
      props: {
        correspondenceId: '123',
        documentTitle: 'correspondence to delete',
      },
      state: {},
    });

    expect(result.state.modal.correspondenceToDelete).toMatchObject({
      correspondenceId: '123',
      documentTitle: 'correspondence to delete',
    });
  });
});
