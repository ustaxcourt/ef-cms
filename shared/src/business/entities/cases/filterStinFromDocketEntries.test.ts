import {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { filterStinFromDocketEntries } from './Case';

const STIN_DOCUMENT_TYPE = INITIAL_DOCUMENT_TYPES.stin.documentType;
const PETITION_DOCUMENT_TYPE = INITIAL_DOCUMENT_TYPES.petition.documentType;

const makeStin = (overrides: Partial<RawDocketEntry> = {}): RawDocketEntry =>
  ({
    docketEntryId: 'stin-id',
    documentType: STIN_DOCUMENT_TYPE,
    eventCode: 'STIN',
    isOnDocketRecord: false,
    ...overrides,
  }) as RawDocketEntry;

const makeRegularEntry = (
  overrides: Partial<RawDocketEntry> = {},
): RawDocketEntry =>
  ({
    docketEntryId: 'regular-id',
    documentType: 'Order',
    eventCode: 'O',
    isOnDocketRecord: true,
    ...overrides,
  }) as RawDocketEntry;

const makePetition = (
  overrides: Partial<RawDocketEntry> = {},
): RawDocketEntry =>
  ({
    docketEntryId: 'petition-id',
    documentType: PETITION_DOCUMENT_TYPE,
    eventCode: 'P',
    isOnDocketRecord: true,
    servedAt: undefined,
    ...overrides,
  }) as RawDocketEntry;

const makeUser = (role: string) => ({ role });

describe('filterStinFromDocketEntries', () => {
  const entriesWithStin = [makeStin(), makeRegularEntry()];

  describe('IRS superuser', () => {
    const user = makeUser(ROLES.irsSuperuser);

    it('includes STIN when petitionIsServedOverride is true', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user, true);
      expect(result).toHaveLength(2);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeDefined();
    });

    it('excludes STIN when petitionIsServedOverride is explicitly false', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user, false);
      expect(result).toHaveLength(1);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeUndefined();
    });

    it('includes STIN when petitionIsServedOverride is undefined (Case constructor path)', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user);
      expect(result).toHaveLength(2);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeDefined();
    });
  });

  describe('petitionsClerk', () => {
    const user = makeUser(ROLES.petitionsClerk);

    it('includes STIN when petitionIsServedOverride is false (petition not served)', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user, false);
      expect(result).toHaveLength(2);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeDefined();
    });

    it('excludes STIN when petitionIsServedOverride is true (petition served)', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user, true);
      expect(result).toHaveLength(1);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeUndefined();
    });

    it('includes STIN when override is undefined and petition entry has no servedAt (not served)', () => {
      const entries = [makeStin(), makeRegularEntry(), makePetition()];
      const result = filterStinFromDocketEntries(entries, user);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeDefined();
    });

    it('excludes STIN when override is undefined and petition entry has servedAt (served)', () => {
      const entries = [
        makeStin(),
        makeRegularEntry(),
        makePetition({ servedAt: '2024-01-01T00:00:00.000Z' }),
      ];
      const result = filterStinFromDocketEntries(entries, user);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeUndefined();
    });
  });

  describe('caseServicesSupervisor', () => {
    const user = makeUser(ROLES.caseServicesSupervisor);

    it('includes STIN when petitionIsServedOverride is false', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user, false);
      expect(result).toHaveLength(2);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeDefined();
    });

    it('excludes STIN when petitionIsServedOverride is true', () => {
      const result = filterStinFromDocketEntries(entriesWithStin, user, true);
      expect(result).toHaveLength(1);
      expect(result.find(d => d.documentType === STIN_DOCUMENT_TYPE)).toBeUndefined();
    });
  });

  describe('docketClerk', () => {
    const user = makeUser(ROLES.docketClerk);

    it('excludes STIN regardless of petitionIsServedOverride', () => {
      expect(
        filterStinFromDocketEntries(entriesWithStin, user, false),
      ).toHaveLength(1);
      expect(
        filterStinFromDocketEntries(entriesWithStin, user, true),
      ).toHaveLength(1);
      expect(
        filterStinFromDocketEntries(entriesWithStin, user),
      ).toHaveLength(1);
    });
  });

  describe('privatePractitioner', () => {
    const user = makeUser(ROLES.privatePractitioner);

    it('excludes STIN regardless of petitionIsServedOverride', () => {
      expect(
        filterStinFromDocketEntries(entriesWithStin, user, true),
      ).toHaveLength(1);
      expect(
        filterStinFromDocketEntries(entriesWithStin, user, false),
      ).toHaveLength(1);
    });
  });

  describe('petitioner', () => {
    const user = makeUser(ROLES.petitioner);

    it('excludes STIN regardless of petitionIsServedOverride', () => {
      expect(
        filterStinFromDocketEntries(entriesWithStin, user, true),
      ).toHaveLength(1);
      expect(
        filterStinFromDocketEntries(entriesWithStin, user, false),
      ).toHaveLength(1);
    });
  });

  describe('undefined user (no user)', () => {
    it('excludes STIN when user is undefined', () => {
      expect(
        filterStinFromDocketEntries(entriesWithStin, undefined, true),
      ).toHaveLength(1);
      expect(
        filterStinFromDocketEntries(entriesWithStin, undefined, false),
      ).toHaveLength(1);
    });
  });

  it('returns entries unchanged when there is no STIN in the list', () => {
    const entries = [makeRegularEntry()];
    const result = filterStinFromDocketEntries(
      entries,
      makeUser(ROLES.docketClerk),
    );
    expect(result).toEqual(entries);
  });
});
