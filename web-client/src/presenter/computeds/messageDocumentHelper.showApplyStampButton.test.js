import { STAMPED_DOCUMENTS_ALLOWLIST } from '../../../../shared/src/business/entities/EntityConstants';
import {
  adcUser,
  chambersUser,
  clerkOfCourtUser,
  docketClerkUser,
  judgeUser,
} from '../../../../shared/src/test/mockUsers';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { messageDocumentHelper as messageDocumentHelperComputed } from './messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('messageDocumentHelper.showApplyStampButton', () => {
  let globalUser;

  const mockDocketEntryId = '7de1dcbf-f6a6-4e5a-a02c-a54b13f61354';

  const messageDocumentHelper = withAppContextDecorator(
    messageDocumentHelperComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
    };
  };

  beforeEach(() => {
    applicationContext
      .getUtilities()
      .formatCase.mockReturnValue({ draftDocuments: [] });
    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue({
        eventCode: 'M006',
      });

    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue({
        eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0],
      });
  });
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  it('should be false when the stamp disposition feature is turned off', () => {
    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(chambersUser),
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0],
            },
          ],
        },
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION.key]: false,
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be false when the user does not have the STAMP_MOTION permission', () => {
    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0],
            },
          ],
        },
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION.key]: true,
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be true when the user is a clerk of the court', () => {
    const user = clerkOfCourtUser;

    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0],
            },
          ],
        },
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION.key]: true,
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
      },
    });

    expect(showApplyStampButton).toBe(true);
  });

  it('should be false when the selected message document is NOT a document that can be stamped', () => {
    applicationContext
      .getUtilities()
      .getAttachmentDocumentById.mockReturnValue({
        eventCode: 'NOT_CORRECT',
      });

    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(judgeUser),
        caseDetail: {
          docketEntries: [],
        },
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION.key]: true,
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be true when the selected message document is not a draft and is a document that can be stamped and the user has the STAMP_MOTION permission', () => {
    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(chambersUser),
        caseDetail: {
          docketEntries: [],
        },
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION.key]: true,
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
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
          eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0],
        },
      ],
    });

    const { showApplyStampButton } = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(adcUser),
        caseDetail: {
          docketEntries: [],
        },
        featureFlags: {
          [ALLOWLIST_FEATURE_FLAGS.STAMP_DISPOSITION.key]: true,
        },
        messageViewerDocumentToDisplay: {
          documentId: mockDocketEntryId,
        },
      },
    });

    expect(showApplyStampButton).toBe(true);
  });
});
