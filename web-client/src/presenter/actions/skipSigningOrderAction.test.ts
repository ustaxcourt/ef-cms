import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { skipSigningOrderAction } from './skipSigningOrderAction';

describe('skipSigningOrderAction', () => {
  it('should redirect to the draft documents', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.output.path).toEqual('/case-detail/123-19/draft-documents');
  });

  it('should set a success message with documentTitle', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('should set a success message with documentType if documentTitle is not set', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('should set created document success message if isCreatingOrder is set', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Order',
            },
          ],
          docketNumber: '123-19',
        },
        docketEntryId: 'abc',
        isCreatingOrder: true,
      },
    });
    expect(result.output.alertSuccess.message).toEqual(
      'Your document has been successfully created and attached to this message',
    );
  });
});
