import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketEntrySelectedFromMessageAction } from './setDocketEntrySelectedFromMessageAction';

describe('setDocketEntrySelectedFromMessageAction', () => {
  const mockDocketEntryId = '1234';
  it('should set documentId on state from props', async () => {
    const { state } = await runAction(setDocketEntrySelectedFromMessageAction, {
      props: {
        docketEntryId: mockDocketEntryId,
      },
      state: {
        caseDetail: { docketEntries: [{ docketEntryId: mockDocketEntryId }] },
      },
    });

    expect(state.documentId).toEqual(mockDocketEntryId);
  });

  it('should set messageViewerDocumentToDisplay including documentId on state', async () => {
    const mockDocketEntry = { docketEntryId: mockDocketEntryId };
    const { state } = await runAction(setDocketEntrySelectedFromMessageAction, {
      props: {
        docketEntryId: mockDocketEntryId,
      },
      state: {
        caseDetail: { docketEntries: [mockDocketEntry] },
      },
    });

    expect(state.messageViewerDocumentToDisplay).toEqual({
      ...mockDocketEntry,
      documentId: mockDocketEntryId,
    });
  });
});
