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

  const createTestState = (overrides = {}) => ({
    recentFilings: mockFilings,
    recentFilingsTableSort: { sortField: 'filedDate', sortOrder: 'desc' },
    user: { role: ROLES.petitioner },
    ...overrides,
  });

  it('should return sorted recent filings with default sort and sort options', () => {
    const result = runCompute(recentFilingsHelper, {
      state: createTestState(),
    });

    expect(result.sortedRecentFilings).toHaveLength(2);
    expect(result.sortedRecentFilings[0].filedDate).toBe('2024-01-15');
    expect(result.sortOptions).toHaveLength(8);
    expect(result.sortOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'docketNumber-asc' }),
        expect.objectContaining({ value: 'filedDate-desc' }),
        expect.objectContaining({ value: 'document-asc' }),
        expect.objectContaining({ value: 'caseTitle-desc' }),
      ]),
    );
  });

  it('should handle empty/null recent filings gracefully', () => {
    const emptyResult = runCompute(recentFilingsHelper, {
      state: createTestState({ recentFilings: [] }),
    });
    const nullResult = runCompute(recentFilingsHelper, {
      state: createTestState({ recentFilings: null }),
    });

    expect(emptyResult.sortedRecentFilings).toEqual([]);
    expect(nullResult.sortedRecentFilings).toEqual([]);
    expect(emptyResult.sortOptions).toHaveLength(8);
  });

  it('should use default sort when no sort is provided', () => {
    const result = runCompute(recentFilingsHelper, {
      state: createTestState({ recentFilingsTableSort: null }),
    });

    expect(result.sortedRecentFilings).toHaveLength(2);
    expect(result.sortedRecentFilings[0].filedDate).toBe('2024-01-15');
  });

  it('should sort by different fields when specified', () => {
    const result = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilingsTableSort: { sortField: 'document', sortOrder: 'asc' },
      }),
    });

    expect(result.sortedRecentFilings[0].document).toBe('Answer');
    expect(result.sortedRecentFilings[1].document).toBe('Petition');
  });

  describe('User Role Permissions', () => {
    const rolesWithAccess = [
      ROLES.petitioner,
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
    ];

    it.each(rolesWithAccess)(
      'should allow %s to access documents with file attached',
      role => {
        const result = runCompute(recentFilingsHelper, {
          state: createTestState({ user: { role } }),
        });

        expect(result.sortedRecentFilings[0].canAccess).toBe(true);
        expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(true);
      },
    );

    it('should deny access to stricken documents and documents without file attached', () => {
      const strickenFiling = { ...mockFilings[0], isStricken: true };
      const noFileFiling = { ...mockFilings[0], isFileAttached: false };

      const strickenResult = runCompute(recentFilingsHelper, {
        state: createTestState({ recentFilings: [strickenFiling] }),
      });
      const noFileResult = runCompute(recentFilingsHelper, {
        state: createTestState({ recentFilings: [noFileFiling] }),
      });

      expect(strickenResult.sortedRecentFilings[0].canAccess).toBe(false);
      expect(noFileResult.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should handle STIN documents with proper role permissions', () => {
      const stinFiling = {
        ...mockFilings[0],
        eventCode: STIN_DOCKET_ENTRY_TYPE.eventCode,
        isFileAttached: true,
        servedAt: '2024-01-15T10:00:00.000Z',
      };

      const irsSuperuserResult = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [stinFiling],
          user: { role: ROLES.irsSuperuser },
        }),
      });
      const petitionerResult = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [stinFiling],
          user: { role: ROLES.petitioner },
        }),
      });

      expect(irsSuperuserResult.sortedRecentFilings[0].canAccess).toBe(true);
      expect(petitionerResult.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should handle unserved STIN documents for internal users', () => {
      const unservedStinFiling = {
        ...mockFilings[0],
        eventCode: STIN_DOCKET_ENTRY_TYPE.eventCode,
        isFileAttached: true,
        servedAt: undefined,
      };

      const petitionsClerkResult = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [unservedStinFiling],
          user: { role: ROLES.petitionsClerk },
        }),
      });
      const irsSuperuserResult = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [unservedStinFiling],
          user: { role: ROLES.irsSuperuser },
        }),
      });

      expect(petitionsClerkResult.sortedRecentFilings[0].canAccess).toBe(true);
      expect(irsSuperuserResult.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should handle users with null/undefined roles', () => {
      const nullRoleResult = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: null } }),
      });
      const undefinedRoleResult = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: undefined } }),
      });

      expect(nullRoleResult.sortedRecentFilings[0].canAccess).toBe(false);
      expect(undefinedRoleResult.sortedRecentFilings[0].canAccess).toBe(false);
    });
  });

  describe('Document Display Properties', () => {
    it('should show document description without link when user cannot access but file is attached', () => {
      const strickenFiling = { ...mockFilings[0], isStricken: true };
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ recentFilings: [strickenFiling] }),
      });

      expect(
        result.sortedRecentFilings[0].showDocumentDescriptionWithoutLink,
      ).toBe(true);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(false);
    });

    it('should show document viewer link for internal users but not external users', () => {
      const internalResult = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: ROLES.petitionsClerk } }),
      });
      const externalResult = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: ROLES.petitioner } }),
      });

      expect(internalResult.sortedRecentFilings[0].showDocumentViewerLink).toBe(
        true,
      );
      expect(externalResult.sortedRecentFilings[0].showDocumentViewerLink).toBe(
        false,
      );
    });

    it('should handle getDocumentDisplayProperties function for different user types', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState(),
      });
      const displayProps = result.getDocumentDisplayProperties(mockFilings[0]);

      expect(displayProps).toBeDefined();
      expect(displayProps.showLinkToDocument).toBeDefined();
      expect(displayProps.showDocumentViewerLink).toBeDefined();
      expect(displayProps.showDocumentDescriptionWithoutLink).toBeDefined();
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle invalid sort parameters by using defaults', () => {
      const invalidFieldResult = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: {
            sortField: 'invalidField' as any,
            sortOrder: 'desc',
          },
        }),
      });
      const invalidOrderResult = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: {
            sortField: 'filedDate',
            sortOrder: 'invalid' as any,
          },
        }),
      });

      expect(invalidFieldResult.sortedRecentFilings).toHaveLength(2);
      expect(invalidOrderResult.sortedRecentFilings).toHaveLength(2);
      expect(invalidFieldResult.sortedRecentFilings[0].filedDate).toBe(
        '2024-01-15',
      );
    });

    it('should handle non-array recentFilings gracefully', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ recentFilings: 'not an array' as any }),
      });

      expect(result.sortedRecentFilings).toEqual([]);
      expect(result.sortOptions).toHaveLength(8);
    });

    it('should handle sealed documents appropriately', () => {
      const sealedFiling = { ...mockFilings[0], isSealed: true };
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ recentFilings: [sealedFiling] }),
      });

      expect(result.sortedRecentFilings[0].isSealed).toBe(true);
    });

    it('should handle getDocumentDisplayProperties with different user roles', () => {
      const externalResult = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: ROLES.petitioner } }),
      });
      const internalResult = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: ROLES.adc } }),
      });

      const externalProps = externalResult.getDocumentDisplayProperties(
        mockFilings[0],
      );
      const internalProps = internalResult.getDocumentDisplayProperties(
        mockFilings[0],
      );

      expect(externalProps.showDocumentViewerLink).toBe(false);
      expect(internalProps.showDocumentViewerLink).toBe(true);
    });
  });
});
