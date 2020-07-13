import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCorrespondenceToDeleteAction } from './setCorrespondenceToDeleteAction';

describe('setCorrespondenceToDeleteAction', () => {
  it('should set state.modal.correspondenceToDelete documentTitle and documentId', async () => {
    const result = await runAction(setCorrespondenceToDeleteAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: '123',
        documentTitle: 'correspondence to delete',
      },
      state: {},
    });

    expect(result.state.modal.correspondenceToDelete).toMatchObject({
      documentId: '123',
      documentTitle: 'correspondence to delete',
    });
  });
});
