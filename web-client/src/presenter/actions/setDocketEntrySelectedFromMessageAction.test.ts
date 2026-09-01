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

  it('should throw when the docket entry is not on the case', async () => {
    await expect(
      runAction(setDocketEntrySelectedFromMessageAction, {
        props: {
          docketEntryId: 'missing-entry',
        },
        state: {
          caseDetail: {
            docketEntries: [{ docketEntryId: mockDocketEntryId }],
            docketNumber: '108-19',
          },
        },
      }),
    ).rejects.toThrow(
      'Could not find docket entry missing-entry on case 108-19',
    );
  });
});
