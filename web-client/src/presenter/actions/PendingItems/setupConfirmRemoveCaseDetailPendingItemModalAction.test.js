import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setupConfirmRemoveCaseDetailPendingItemModalAction } from './setupConfirmRemoveCaseDetailPendingItemModalAction';

describe('setupConfirmRemoveCaseDetailPendingItemModalAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(
      setupConfirmRemoveCaseDetailPendingItemModalAction,
      {
        modules: {
          presenter,
        },
        props: {
          caseDetail: {
            documents: [
              {
                documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                documentTitle: 'something great',
              },
            ],
          },
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        state: {},
      },
    );
    expect(result.state.modal.documentId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.documentTitle).toEqual('something great');
  });
});
