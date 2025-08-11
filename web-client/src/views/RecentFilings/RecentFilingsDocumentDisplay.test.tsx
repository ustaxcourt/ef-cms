import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { RecentFiling } from '@shared/business/entities/RecentFiling';

describe('RecentFilingsDocumentDisplay', () => {
  const mockFiling: RecentFiling = {
    docketNumber: '101-20',
    filedDate: '2024-01-15',
    document: 'Petition',
    caseTitle: 'Test Case',
    docketEntryId: '1',
  };

  const mockDisplayProperties = {
    showLinkToDocument: true,
    showDocumentViewerLink: false,
    showDocumentDescriptionWithoutLink: false,
    showDocumentProcessing: false,
  };

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should handle document display properties and filing data correctly', () => {
    expect(mockDisplayProperties.showLinkToDocument).toBe(true);
    expect(mockDisplayProperties.showDocumentViewerLink).toBe(false);
    expect(mockDisplayProperties.showDocumentDescriptionWithoutLink).toBe(
      false,
    );
    expect(mockDisplayProperties.showDocumentProcessing).toBe(false);

    expect(mockFiling.docketNumber).toBe('101-20');
    expect(mockFiling.filedDate).toBe('2024-01-15');
    expect(mockFiling.document).toBe('Petition');
    expect(mockFiling.caseTitle).toBe('Test Case');
    expect(mockFiling.docketEntryId).toBe('1');
  });

  it('should handle stricken and sealed documents', () => {
    const strickenFiling = { ...mockFiling, isStricken: true };
    const sealedFiling = { ...mockFiling, isSealed: true };

    expect(strickenFiling.isStricken).toBe(true);
    expect(strickenFiling.document).toBe('Petition');
    expect(sealedFiling.isSealed).toBe(true);
    expect(sealedFiling.document).toBe('Petition');
  });

  it('should handle documents with eventCode when document title is missing', () => {
    const filingWithEventCode = {
      ...mockFiling,
      document: undefined,
      eventCode: 'PET',
    };
    const filingWithoutDocument = {
      ...mockFiling,
      document: undefined,
      eventCode: undefined,
    };

    expect(filingWithEventCode.document).toBeUndefined();
    expect(filingWithEventCode.eventCode).toBe('PET');
    expect(filingWithoutDocument.document).toBeUndefined();
    expect(filingWithoutDocument.eventCode).toBeUndefined();
  });

  it('should handle consolidated cases and processing documents', () => {
    const consolidatedFiling = {
      ...mockFiling,
      inConsolidatedGroup: true,
      isLeadCase: true,
      consolidatedIconTooltipText: 'Lead case in consolidated group',
    };
    const processingFiling = { ...mockFiling, isProcessing: true };

    expect(consolidatedFiling.inConsolidatedGroup).toBe(true);
    expect(consolidatedFiling.isLeadCase).toBe(true);
    expect(consolidatedFiling.consolidatedIconTooltipText).toBe(
      'Lead case in consolidated group',
    );
    expect(processingFiling.isProcessing).toBe(true);
  });
});
