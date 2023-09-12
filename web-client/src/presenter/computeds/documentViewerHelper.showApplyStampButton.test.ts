import {
  INITIAL_DOCUMENT_TYPES,
  STAMPED_DOCUMENTS_ALLOWLIST,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { petitionsClerkUser } from '../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('documentViewerHelper.showApplyStampButton', () => {
  const documentViewerHelper = withAppContextDecorator(
    documentViewerHelperComputed,
    applicationContext,
  );

  const mockDocketEntryId = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const baseDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: mockDocketEntryId,
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: INITIAL_DOCUMENT_TYPES.petition.documentType,
    index: 1,
    isOnDocketRecord: true,
  };

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      viewerDocumentToDisplay: {
        docketEntryId: mockDocketEntryId,
      },
    };
  };

  it('should be false when the user does not have the STAMP_MOTION permission', () => {
    const { showApplyStampButton } = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [
            { ...baseDocketEntry, eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0] },
          ],
        },
        permissions: { STAMP_MOTION: false },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be false when the selected document is not a document that can be stamped', () => {
    const { showApplyStampButton } = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [{ ...baseDocketEntry, eventCode: 'NOT_CORRECT' }],
        },
        permissions: { STAMP_MOTION: true },
      },
    });

    expect(showApplyStampButton).toBe(false);
  });

  it('should be true when the selected document can be stamped and the user has STAMP_MOTION permissions', () => {
    const { showApplyStampButton } = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [
            { ...baseDocketEntry, eventCode: STAMPED_DOCUMENTS_ALLOWLIST[0] },
          ],
        },
        permissions: { STAMP_MOTION: true },
      },
    });

    expect(showApplyStampButton).toBe(true);
  });
});
