import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditMotionOrderResponseFormAction } from './setEditMotionOrderResponseFormAction';

describe('setEditMotionOrderResponseFormAction', () => {
  it('should set form state and return message detail path when parentMessageId exists', async () => {
    const mockDraftOrderState = {
      previousDocument: {
        docketEntryId: '123',
      },
      someFormField: 'value',
    };

    const result = await runAction(setEditMotionOrderResponseFormAction, {
      props: {
        parentMessageId: 'abc',
        caseDetail: { docketNumber: '123-45' },
        docketEntryIdToEdit: 'xyz',
      },
      state: {
        documentToEdit: {
          draftOrderState: mockDraftOrderState,
        },
      },
    });

    expect(result.state.form).toEqual(mockDraftOrderState);
    expect(result.state.docketEntryId).toEqual('123');
    expect(result.output.path).toEqual(
      '/messages/123-45/message-detail/abc/xyz/motion-order-response-edit',
    );
  });

  it('should set form state and return case detail path when no parentMessageId', async () => {
    const mockDraftOrderState = {
      previousDocument: {
        docketEntryId: '123',
      },
      someFormField: 'value',
    };

    const result = await runAction(setEditMotionOrderResponseFormAction, {
      props: {
        caseDetail: { docketNumber: '123-45' },
        docketEntryIdToEdit: 'xyz',
      },
      state: {
        documentToEdit: {
          draftOrderState: mockDraftOrderState,
        },
      },
    });

    expect(result.state.form).toEqual(mockDraftOrderState);
    expect(result.state.docketEntryId).toEqual('123');
    expect(result.output.path).toEqual(
      '/case-detail/123-45/documents/xyz/motion-order-response-edit',
    );
  });
});
