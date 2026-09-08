import { recentFilingsHelper as recentFilingsHelperComputed } from './recentFilingsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';
import {
  ROLES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  CASE_STATUS_TYPES,
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
  status: CASE_STATUS_TYPES.new,
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
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    }),
  ],
  recentFilingsTableSort: { sortField: 'filedDate', sortOrder: 'desc' },
  user: { role: ROLES.petitioner },
  ...overrides,
});

describe('recentFilingsHelper', () => {
  describe('basic functionality', () => {
    it('should return every recent filing', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState(),
      });

      expect(result.sortedRecentFilings).toHaveLength(2);
    });

    it('should sort by filed date descending by default', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState(),
      });

      expect(result.sortedRecentFilings[0].filedDate).toBe('2024-01-15');
    });

    it('should return a sort option for each field and direction', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState(),
      });

      expect(result.sortOptions).toHaveLength(10);
    });

    it('should return an empty array when there are no recent filings', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ recentFilings: [] }),
      });

      expect(result.sortedRecentFilings).toEqual([]);
    });

    it('should return every filing when the sort parameters are invalid', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: {
            sortField: 'invalidField' as any,
            sortOrder: 'invalid' as any,
          },
        }),
      });

      expect(result.sortedRecentFilings).toHaveLength(2);
    });
  });

  describe('sorting', () => {
    it('should sort by document ascending', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: { sortField: 'document', sortOrder: 'asc' },
        }),
      });

      expect(result.sortedRecentFilings[0].document).toBe('Answer');
      expect(result.sortedRecentFilings[1].document).toBe('Petition');
    });

    it('should sort by case status ascending', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: { sortField: 'status', sortOrder: 'asc' },
        }),
      });

      expect(result.sortedRecentFilings[0].status).toBe(
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );
      expect(result.sortedRecentFilings[1].status).toBe(CASE_STATUS_TYPES.new);
    });

    it('should sort by case title descending', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: { sortField: 'caseTitle', sortOrder: 'desc' },
        }),
      });

      expect(result.sortedRecentFilings[0].caseTitle).toBe('Test Case 2');
      expect(result.sortedRecentFilings[1].caseTitle).toBe('Test Case 1');
    });

    it('should sort by docket number descending', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilingsTableSort: {
            sortField: 'docketNumber',
            sortOrder: 'desc',
          },
        }),
      });

      expect(result.sortedRecentFilings[0].docketNumber).toBe('102-20');
      expect(result.sortedRecentFilings[1].docketNumber).toBe('101-20');
    });
  });

  describe('document access control', () => {
    it('should allow access to a served document with a file attached', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState(),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
      expect(result.sortedRecentFilings[0].showLinkToDocument).toBe(true);
    });

    it('should deny access to a stricken document', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createFiling({ isStricken: true })],
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should deny access when no file is attached', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createFiling({ isFileAttached: false })],
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should deny access when the user has no role', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: null } }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
    });
  });

  describe('documents sealed to external users', () => {
    const createSealedToExternalFiling = () =>
      createFiling({
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
      });

    it('should deny access to an external user', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createSealedToExternalFiling()],
          user: { role: ROLES.petitioner },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should allow access to an internal user', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createSealedToExternalFiling()],
          user: { role: ROLES.petitionsClerk },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });
  });

  describe('documents sealed to the public', () => {
    const createSealedToPublicFiling = () =>
      createFiling({
        isSealed: true,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
      });

    it('should allow access to an external user', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createSealedToPublicFiling()],
          user: { role: ROLES.petitioner },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });

    it('should allow access to an internal user', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createSealedToPublicFiling()],
          user: { role: ROLES.petitionsClerk },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });
  });

  describe('case-level sealing', () => {
    it('should allow an external user to access a document in a sealed case', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createFiling({ caseIsSealed: true })],
          user: { role: ROLES.petitioner },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });

    it('should allow an internal user to access a document in a sealed case', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createFiling({ caseIsSealed: true })],
          user: { role: ROLES.petitionsClerk },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });

    it('should deny access in a sealed case when no file is attached', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [
            createFiling({ caseIsSealed: true, isFileAttached: false }),
          ],
          user: { role: ROLES.petitioner },
        }),
      });

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
    });
  });

  describe('unserved documents', () => {
    const runForUnservedEventCode = (eventCode: string) =>
      runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createFiling({ eventCode, servedAt: undefined })],
          user: { role: ROLES.petitioner },
        }),
      });

    it('should deny external access to an unserved order', () => {
      const result = runForUnservedEventCode('O');

      expect(result.sortedRecentFilings[0].canAccess).toBe(false);
    });

    it('should allow external access to an unserved petition', () => {
      const result = runForUnservedEventCode('P');

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });

    it('should allow external access to an unserved notice of attachments', () => {
      const result = runForUnservedEventCode('NOT');

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });

    it('should allow external access to an unserved standing pretrial order for small case', () => {
      const result = runForUnservedEventCode('SPOS');

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });

    it('should allow external access to an unserved standing scheduling order', () => {
      const result = runForUnservedEventCode('SSO');

      expect(result.sortedRecentFilings[0].canAccess).toBe(true);
    });
  });

  describe('display properties', () => {
    it('should not show the document viewer link to an external user', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: ROLES.petitioner } }),
      });

      expect(result.sortedRecentFilings[0].showDocumentViewerLink).toBe(false);
    });

    it('should show the document viewer link to an internal user', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({ user: { role: ROLES.petitionsClerk } }),
      });

      expect(result.sortedRecentFilings[0].showDocumentViewerLink).toBe(true);
    });

    it('should show the description without a link for a stricken document', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState({
          recentFilings: [createFiling({ isStricken: true })],
        }),
      });

      expect(
        result.sortedRecentFilings[0].showDocumentDescriptionWithoutLink,
      ).toBe(true);
    });

    it('should expose getDocumentDisplayProperties for an arbitrary filing', () => {
      const result = runCompute(recentFilingsHelper, {
        state: createTestState(),
      });

      const displayProps = result.getDocumentDisplayProperties(createFiling());

      expect(displayProps).toBeDefined();
      expect(displayProps.showLinkToDocument).toBeDefined();
    });
  });

  describe('case association filtering', () => {
    it('should filter out cases where the user is not associated', () => {
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

      expect(result.sortedRecentFilings).toHaveLength(2);
      expect(result.sortedRecentFilings.map(f => f.docketNumber)).toEqual([
        '103-20',
        '101-20',
      ]);
    });
  });
});
