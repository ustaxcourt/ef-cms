import { applicationContext } from '../../applicationContext';
import { docketClerkUser } from '../../../../shared/src/test/mockUsers';
import { documentViewerLinksHelper as documentViewerLinksHelperComputed } from './documentViewerLinksHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const documentViewerLinksHelper = withAppContextDecorator(
  documentViewerLinksHelperComputed,
  applicationContext,
);

describe('documentViewerLinksHelper', () => {
  const DOCKET_NUMBER = '101-20';
  const DOCKET_ENTRY_ID = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const baseDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: DOCKET_ENTRY_ID,
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: 'P',
    index: 1,
    isOnDocketRecord: true,
  };

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      viewerDocumentToDisplay: {
        docketEntryId: DOCKET_ENTRY_ID,
      },
    };
  };

  beforeAll(() => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);
  });

  it('should return documentViewerLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.documentViewerLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/document-view?docketEntryId=${DOCKET_ENTRY_ID}`,
    );
  });

  it('should return completeQcLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.completeQcLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/documents/${DOCKET_ENTRY_ID}/edit`,
    );
  });

  it('should return reviewAndServePetitionLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.reviewAndServePetitionLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/petition-qc/document-view/${DOCKET_ENTRY_ID}`,
    );
  });

  it('should return signStipulatedDecisionLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.signStipulatedDecisionLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/edit-order/${DOCKET_ENTRY_ID}/sign`,
    );
  });
});
