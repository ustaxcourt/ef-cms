import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { messageDocumentHelper as messageDocumentHelperComputed } from './messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('messageDocumentHelper', () => {
  const mockDocketEntryId = '7de1dcbf-f6a6-4e5a-a02c-a54b13f61354';

  const messageDocumentHelper = withAppContextDecorator(
    messageDocumentHelperComputed,
    applicationContext,
  );

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({ role: 'general' });
    applicationContext
      .getUtilities()
      .formatCase.mockReturnValue({ draftDocuments: [] });
    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue({
        eventCode: 'M006',
      });
  });

  it('should be false when the user does not have the STAMP_MOTION permission', () => {
    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue({
        eventCode: 'M006',
      });

    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              eventCode: 'M006',
            },
          ],
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
        permissions: { STAMP_MOTION: false },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be false when the selected message document is NOT a document that can be stamped', () => {
    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue({
        eventCode: 'NOT_CORRECT',
      });

    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketEntries: [],
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
        permissions: { STAMP_MOTION: true },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be true when the selected message document is not a draft and is a document that can be stamped and the user has the STAMP_MOTION permission', () => {
    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketEntries: [],
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
        permissions: { STAMP_MOTION: true },
      },
    });

    expect(showApplyStampButton).toBe(true);
  });

  it('should be true when the selected message document is a draft and is a document that can be stamped and the user has the STAMP_MOTION permission', () => {
    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue([]);
    applicationContext.getUtilities().formatCase.mockReturnValue({
      draftDocuments: [
        {
          docketEntryId: mockDocketEntryId,
          eventCode: 'M006',
        },
      ],
    });

    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketEntries: [],
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
        permissions: { STAMP_MOTION: true },
      },
    });

    expect(showApplyStampButton).toBe(true);
  });
});
