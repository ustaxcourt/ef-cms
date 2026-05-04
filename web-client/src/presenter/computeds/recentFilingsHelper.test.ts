import { recentFilingsHelper as recentFilingsHelperComputed } from './recentFilingsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';
import {
  ROLES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
} from '@shared/business/entities/EntityConstants';

const recentFilingsHelper = withAppContextDecorator(
  recentFilingsHelperComputed,
);

const createFiling = (overrides: Partial<RecentFiling> = {}): RecentFiling => ({
  docketNumber: '101-20',
  filedDate: '2024-01-15',
  document: 'Petition',
  caseTitle: 'Test Case 1',
  docketEntryId: '1',
  isFileAttached: true,
  eventCode: 'P',
  servedAt: '2024-01-15T10:00:00.000Z',
  status: 'new',
  ...overrides,
});

const createTestState = (overrides = {}) => ({
  recentFilings: [
    createFiling(),
    createFiling({
      docketNumber: '102-20',
      filedDate: '2024-01-10',
      document: 'Answer',
      caseTitle: 'Test Case 2',
      docketEntryId: '2',
    }),
  ],
  recentFilingsTableSort: { sortField: 'filedDate', sortOrder: 'desc' },
  user: { role: ROLES.petitioner },
  ...overrides,
});

describe('recentFilingsHelper', () => {
  it('should handle basic functionality and edge cases', () => {
    // Basic functionality
    const result = runCompute(recentFilingsHelper, {
      state: createTestState(),
    });
    expect(result.sortedRecentFilings).toHaveLength(2);
    expect(result.sortedRecentFilings[0].filedDate).toBe('2024-01-15');
    expect(result.sortOptions).toHaveLength(10);

    // Empty/null handling
    const emptyResult = runCompute(recentFilingsHelper, {
      state: createTestState({ recentFilings: [] }),
    });
    expect(emptyResult.sortedRecentFilings).toEqual([]);

    // Invalid sort parameters
    const invalidResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilingsTableSort: {
          sortField: 'invalidField' as any,
          sortOrder: 'invalid' as any,
        },
      }),
    });
    expect(invalidResult.sortedRecentFilings).toHaveLength(2);
  });

  it('should handle sorting by different fields', () => {
    const result = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilingsTableSort: { sortField: 'document', sortOrder: 'asc' },
      }),
    });
    expect(result.sortedRecentFilings[0].document).toBe('Answer');
    expect(result.sortedRecentFilings[1].document).toBe('Petition');
  });

  it('should handle document access control for different scenarios', () => {
    // Normal access
    const normalResult = runCompute(recentFilingsHelper, {
      state: createTestState(),
    });
    expect(normalResult.sortedRecentFilings[0].canAccess).toBe(true);
    expect(normalResult.sortedRecentFilings[0].showLinkToDocument).toBe(true);

    // Stricken document
    const strickenResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [createFiling({ isStricken: true })],
      }),
    });
    expect(strickenResult.sortedRecentFilings[0].canAccess).toBe(false);

    // No file attached
    const noFileResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [createFiling({ isFileAttached: false })],
      }),
    });
    expect(noFileResult.sortedRecentFilings[0].canAccess).toBe(false);

    // Null role
    const nullRoleResult = runCompute(recentFilingsHelper, {
      state: createTestState({ user: { role: null } }),
    });
    expect(nullRoleResult.sortedRecentFilings[0].canAccess).toBe(false);
  });

  it('should handle sealed documents with different sealedTo types', () => {
    // Document sealed to external users (all parties)
    const sealedToExternalFiling = createFiling({
      isSealed: true,
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
    });

    // External user cannot access document sealed to external
    const externalUserResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedToExternalFiling],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(externalUserResult.sortedRecentFilings[0].canAccess).toBe(false);

    // Internal user can access document sealed to external
    const internalUserResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedToExternalFiling],
        user: { role: ROLES.petitionsClerk },
      }),
    });
    expect(internalUserResult.sortedRecentFilings[0].canAccess).toBe(true);

    // Document sealed to public
    const sealedToPublicFiling = createFiling({
      isSealed: true,
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    });

    // External user (petitioner) can access document sealed to public
    const externalUserPublicResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedToPublicFiling],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(externalUserPublicResult.sortedRecentFilings[0].canAccess).toBe(
      true,
    );

    // Internal user can access document sealed to public
    const internalUserPublicResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedToPublicFiling],
        user: { role: ROLES.petitionsClerk },
      }),
    });
    expect(internalUserPublicResult.sortedRecentFilings[0].canAccess).toBe(
      true,
    );
  });

  it('should handle case-level sealing', () => {
    // Document in a sealed case
    const sealedCaseFiling = createFiling({
      caseIsSealed: true,
    });

    // External user (petitioner) can access documents in sealed cases
    const externalUserResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedCaseFiling],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(externalUserResult.sortedRecentFilings[0].canAccess).toBe(true);

    // Internal user can access documents in sealed cases
    const internalUserResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedCaseFiling],
        user: { role: ROLES.petitionsClerk },
      }),
    });
    expect(internalUserResult.sortedRecentFilings[0].canAccess).toBe(true);

    // Document in sealed case with no file attached
    const sealedCaseNoFileFiling = createFiling({
      caseIsSealed: true,
      isFileAttached: false,
    });

    // No access if no file attached, even in sealed case
    const noFileResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [sealedCaseNoFileFiling],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(noFileResult.sortedRecentFilings[0].canAccess).toBe(false);
  });

  it('should handle unserved documents based on event codes', () => {
    // Unserved Order (not allowed for external users)
    const unservedOrder = createFiling({
      eventCode: 'O',
      servedAt: undefined,
    });

    const orderResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [unservedOrder],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(orderResult.sortedRecentFilings[0].canAccess).toBe(false);

    // Unserved Petition (allowed for external users)
    const unservedPetition = createFiling({
      eventCode: 'P',
      servedAt: undefined,
    });

    const petitionResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [unservedPetition],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(petitionResult.sortedRecentFilings[0].canAccess).toBe(true);

    // Unserved Notice of Attachments (allowed for external users)
    const unservedNotice = createFiling({
      eventCode: 'NOT',
      servedAt: undefined,
    });

    const noticeResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [unservedNotice],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(noticeResult.sortedRecentFilings[0].canAccess).toBe(true);

    // Unserved unservable document (always accessible)
    const unservedUnservable = createFiling({
      eventCode: 'SPOS',
      servedAt: undefined,
    });

    const unservableResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [unservedUnservable],
        user: { role: ROLES.petitioner },
      }),
    });
    expect(unservableResult.sortedRecentFilings[0].canAccess).toBe(true);
  });

  it('should handle display properties and user types', () => {
    // External user
    const externalResult = runCompute(recentFilingsHelper, {
      state: createTestState({ user: { role: ROLES.petitioner } }),
    });
    expect(externalResult.sortedRecentFilings[0].showDocumentViewerLink).toBe(
      false,
    );

    // Internal user
    const internalResult = runCompute(recentFilingsHelper, {
      state: createTestState({ user: { role: ROLES.petitionsClerk } }),
    });
    expect(internalResult.sortedRecentFilings[0].showDocumentViewerLink).toBe(
      true,
    );

    // Document description without link
    const strickenResult = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [createFiling({ isStricken: true })],
      }),
    });
    expect(
      strickenResult.sortedRecentFilings[0].showDocumentDescriptionWithoutLink,
    ).toBe(true);

    // getDocumentDisplayProperties function
    const result = runCompute(recentFilingsHelper, {
      state: createTestState(),
    });
    const displayProps = result.getDocumentDisplayProperties(createFiling());
    expect(displayProps).toBeDefined();
    expect(displayProps.showLinkToDocument).toBeDefined();
  });

  it('should filter out cases where user is not associated', () => {
    const result = runCompute(recentFilingsHelper, {
      state: createTestState({
        recentFilings: [
          createFiling({
            docketNumber: '101-20',
            filedDate: '2024-01-15',
            isRequestingUserAssociated: true,
          }),
          createFiling({
            docketNumber: '102-20',
            filedDate: '2024-01-12',
            isRequestingUserAssociated: false,
          }),
          createFiling({
            docketNumber: '103-20',
            filedDate: '2024-01-18',
            isRequestingUserAssociated: true,
          }),
        ],
      }),
    });

    // Should only show cases where user is associated
    expect(result.sortedRecentFilings).toHaveLength(2);
    expect(result.sortedRecentFilings.map(f => f.docketNumber)).toEqual([
      '103-20',
      '101-20',
    ]);
  });
});
