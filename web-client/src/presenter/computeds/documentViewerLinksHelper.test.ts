import { applicationContext } from '../../applicationContext';
import { documentViewerLinksHelper as documentViewerLinksHelperComputed } from './documentViewerLinksHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('documentViewerLinksHelper', () => {
  const mockDocketNumber = '101-20';
  const mockDocketEntryId = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const documentViewerLinksHelper = withAppContextDecorator(
    documentViewerLinksHelperComputed,
    applicationContext,
  );

  it('should return an empty object when state.viewerDocumentToDisplay is undefined', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {},
        viewerDocumentToDisplay: undefined,
      },
    });

    expect(result).toEqual({});
  });

  it('should return applyStampFromCaseDetailsLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        viewerDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    expect(result.applyStampFromCaseDetailsLink).toEqual(
      `/case-detail/${mockDocketNumber}/documents/${mockDocketEntryId}/apply-stamp`,
    );
  });

  it('should return redirectUrl with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        viewerDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    expect(result.redirectUrl).toEqual(
      `/case-detail/${mockDocketNumber}/document-view?docketEntryId=${mockDocketEntryId}`,
    );
  });

  it('should return documentViewerLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        viewerDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    expect(result.documentViewerLink).toEqual(
      `/case-detail/${mockDocketNumber}/document-view?docketEntryId=${mockDocketEntryId}`,
    );
  });

  it('should return completeQcLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        viewerDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    expect(result.completeQcLink).toEqual(
      `/case-detail/${mockDocketNumber}/documents/${mockDocketEntryId}/edit`,
    );
  });

  it('should return reviewAndServePetitionLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        viewerDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    expect(result.reviewAndServePetitionLink).toEqual(
      `/case-detail/${mockDocketNumber}/petition-qc/document-view/${mockDocketEntryId}`,
    );
  });

  it('should return signStipulatedDecisionLink with docketNumber and viewerDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(documentViewerLinksHelper, {
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        viewerDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    expect(result.signStipulatedDecisionLink).toEqual(
      `/case-detail/${mockDocketNumber}/edit-order/${mockDocketEntryId}/sign`,
    );
  });
});
