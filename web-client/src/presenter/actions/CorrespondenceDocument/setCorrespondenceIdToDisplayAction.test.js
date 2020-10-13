import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCorrespondenceIdToDisplayAction } from './setCorrespondenceIdToDisplayAction';

describe('setCorrespondenceIdToDisplayAction', () => {
  it('should set state.correspondenceDocumentId to the value passed in props', async () => {
    const result = await runAction(setCorrespondenceIdToDisplayAction, {
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
