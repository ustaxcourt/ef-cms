import { runAction } from '@web-client/presenter/test.cerebral';
import { setupConfirmRemoveCaseDetailPendingItemModalAction } from './setupConfirmRemoveCaseDetailPendingItemModalAction';

describe('setupConfirmRemoveCaseDetailPendingItemModalAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(
      setupConfirmRemoveCaseDetailPendingItemModalAction,
      {
        props: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                documentTitle: 'something great',
              },
            ],
          },
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        state: {},
      },
    );
    expect(result.state.modal.docketEntryId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.documentTitle).toEqual('something great');
  });

  it('should set the state from props and set state.modal.documentTitle to the documentType if documentTitle does not exist', async () => {
    const result = await runAction(
      setupConfirmRemoveCaseDetailPendingItemModalAction,
      {
        props: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                documentType: 'no way',
              },
            ],
          },
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        state: {},
      },
    );
    expect(result.state.modal.docketEntryId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.documentTitle).toEqual('no way');
  });
});
