import { recentFilingsHelper as recentFilingsHelperComputed } from './recentFilingsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { RecentFiling } from '@shared/business/entities/RecentFiling';
import {
  ROLES,
  STIN_DOCKET_ENTRY_TYPE,
} from '@shared/business/entities/EntityConstants';

const recentFilingsHelper = withAppContextDecorator(
  recentFilingsHelperComputed,
);

describe('recentFilingsHelper', () => {
  const mockFilings: RecentFiling[] = [
    {
      docketNumber: '101-20',
      filedDate: '2024-01-15',
      document: 'Petition',
      caseTitle: 'Test Case 1',
      docketEntryId: '1',
      isFileAttached: true,
    },
    {
      docketNumber: '102-20',
      filedDate: '2024-01-10',
      document: 'Answer',
      caseTitle: 'Test Case 2',
      docketEntryId: '2',
      isFileAttached: true,
    },
  ];

  it('should return sorted recent filings with default sort', () => {
    const result = runCompute(recentFilingsHelper, {
      state: {
        recentFilings: mockFilings,
        recentFilingsTableSort: {
          sortField: 'filedDate',
          sortOrder: 'desc',
        },
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(result.sortedRecentFilings).toHaveLength(2);
    expect(result.sortedRecentFilings[0].filedDate).toBe('2024-01-15');
    expect(result.sortedRecentFilings[1].filedDate).toBe('2024-01-10');
  });

  it('should return sort options for all fields', () => {
    const result = runCompute(recentFilingsHelper, {
      state: {
        recentFilings: mockFilings,
        recentFilingsTableSort: {
          sortField: 'filedDate',
          sortOrder: 'desc',
        },
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(result.sortOptions).toHaveLength(8); // 4 fields × 2 orders each
    expect(result.sortOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'docketNumber-asc' }),
        expect.objectContaining({ value: 'docketNumber-desc' }),
        expect.objectContaining({ value: 'filedDate-asc' }),
        expect.objectContaining({ value: 'filedDate-desc' }),
        expect.objectContaining({ value: 'document-asc' }),
        expect.objectContaining({ value: 'document-desc' }),
        expect.objectContaining({ value: 'caseTitle-asc' }),
        expect.objectContaining({ value: 'caseTitle-desc' }),
      ]),
    );
  });

  it('should handle empty recent filings', () => {
    const result = runCompute(recentFilingsHelper, {
      state: {
        recentFilings: [],
        recentFilingsTableSort: {
          sortField: 'filedDate',
          sortOrder: 'desc',
        },
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(result.sortedRecentFilings).toEqual([]);
    expect(result.sortOptions).toHaveLength(8);
  });

  it('should handle null recent filings', () => {
    const result = runCompute(recentFilingsHelper, {
      state: {
        recentFilings: null,
        recentFilingsTableSort: {
          sortField: 'filedDate',
          sortOrder: 'desc',
        },
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(result.sortedRecentFilings).toEqual([]);
    expect(result.sortOptions).toHaveLength(8);
  });

  it('should use default sort when no sort is provided', () => {
    const result = runCompute(recentFilingsHelper, {
      state: {
        recentFilings: mockFilings,
        recentFilingsTableSort: null,
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(result.sortedRecentFilings).toHaveLength(2);
    expect(result.sortedRecentFilings[0].filedDate).toBe('2024-01-15');
    expect(result.sortedRecentFilings[1].filedDate).toBe('2024-01-10');
  });

  it('should sort by different fields when specified', () => {
    const result = runCompute(recentFilingsHelper, {
      state: {
        recentFilings: mockFilings,
        recentFilingsTableSort: {
          sortField: 'document',
          sortOrder: 'asc',
        },
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(result.sortedRecentFilings[0].document).toBe('Answer');
    expect(result.sortedRecentFilings[1].document).toBe('Petition');
  });

  // User-specific tests
  describe('User Role Permissions', () => {
    it('should allow petitioner to access documents with file attached', () => {
      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: mockFilings,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.petitioner,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(true);
    });

    it('should allow private practitioner to access documents with file attached', () => {
      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: mockFilings,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.privatePractitioner,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(true);
    });

    it('should allow IRS practitioner to access documents with file attached', () => {
      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: mockFilings,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.irsPractitioner,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(true);
    });

    it('should deny access to stricken documents for all users', () => {
      const strickenFilings: RecentFiling[] = [
        {
          ...mockFilings[0],
          isStricken: true,
        },
      ];

      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: strickenFilings,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.petitioner,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(false);
    });

    it('should handle documents without file attached', () => {
      const filingsWithoutFile: RecentFiling[] = [
        {
          ...mockFilings[0],
          isFileAttached: false,
        },
      ];

      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: filingsWithoutFile,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.petitioner,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(false);
    });

    it('should handle STIN documents with proper role permissions', () => {
      const stinFiling: RecentFiling[] = [
        {
          ...mockFilings[0],
          eventCode: STIN_DOCKET_ENTRY_TYPE.eventCode,
          isFileAttached: true,
          servedAt: '2024-01-15T10:00:00.000Z',
        },
      ];

      // Test IRS Superuser access to served STIN documents
      const irsSuperuserResult = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: stinFiling,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.irsSuperuser,
          },
        },
      });

      expect(irsSuperuserResult.sortedRecentFilings[0].canAccess).toBe(true);

      // Test Petitioner access to served STIN documents (should be denied)
      const petitionerResult = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: stinFiling,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.petitioner,
          },
        },
      });

      expect(petitionerResult.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should handle sealed documents appropriately', () => {
      const sealedFiling: RecentFiling[] = [
        {
          ...mockFilings[0],
          isSealed: true,
        },
      ];

      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: sealedFiling,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: ROLES.petitioner,
          },
        },
      });

      expect(result.sortedRecentFilings[0].isSealed).toBe(true);
    });

    it('should handle user with no role', () => {
      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: mockFilings,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: null,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(false);
    });

    it('should handle user with undefined role', () => {
      const result = runCompute(recentFilingsHelper, {
        state: {
          recentFilings: mockFilings,
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'desc',
          },
          user: {
            role: undefined,
          },
        },
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(false);
    });
  });
});
