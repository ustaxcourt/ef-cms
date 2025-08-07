import { sortRecentFilings } from './sortRecentFilings';
import { RecentFiling } from '@shared/business/entities/RecentFiling';

interface ExtendedRecentFiling extends RecentFiling {
  extraField?: string;
}

type SortableField = 'docketNumber' | 'filedDate' | 'document' | 'caseTitle';

const TEST_DOCKET_NUMBERS = {
  VALID: '101-20',
  INVALID_1: 'invalid-docket',
  INVALID_2: 'another-invalid',
} as const;

const TEST_DATES = {
  EARLY: '2024-01-10',
  MIDDLE: '2024-01-15',
  LATE: '2024-01-20',
} as const;

const TEST_DOCUMENTS = {
  PETITION: 'Petition',
  ANSWER: 'Answer',
  MOTION: 'Motion',
} as const;

const TEST_CASE_TITLES = {
  CASE_1: 'Test Case 1',
  CASE_2: 'Test Case 2',
  CASE_3: 'Test Case 3',
} as const;

const TEST_EXTRA_FIELDS = {
  ALPHA: 'Alpha',
  BETA: 'Beta',
  ZEBRA: 'Zebra',
} as const;

describe('sortRecentFilings', () => {
  const mockFilings: RecentFiling[] = [
    {
      docketNumber: TEST_DOCKET_NUMBERS.VALID,
      filedDate: TEST_DATES.MIDDLE,
      document: TEST_DOCUMENTS.PETITION,
      caseTitle: TEST_CASE_TITLES.CASE_1,
      docketEntryId: '1',
    },
    {
      docketNumber: '102-20',
      filedDate: TEST_DATES.EARLY,
      document: TEST_DOCUMENTS.ANSWER,
      caseTitle: TEST_CASE_TITLES.CASE_2,
      docketEntryId: '2',
    },
    {
      docketNumber: '103-20',
      filedDate: TEST_DATES.LATE,
      document: TEST_DOCUMENTS.MOTION,
      caseTitle: TEST_CASE_TITLES.CASE_3,
      docketEntryId: '3',
    },
  ];

  it('should sort by filedDate descending by default', () => {
    const result = sortRecentFilings(mockFilings);
    expect(result[0].filedDate).toBe(TEST_DATES.LATE);
    expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(result[2].filedDate).toBe(TEST_DATES.EARLY);
  });

  it('should handle empty/null/undefined input gracefully', () => {
    expect(sortRecentFilings([])).toEqual([]);
    expect(sortRecentFilings(null as unknown as RecentFiling[])).toEqual([]);
    expect(sortRecentFilings(undefined as unknown as RecentFiling[])).toEqual(
      [],
    );
  });

  it('should handle single item array', () => {
    const singleFiling = [mockFilings[0]];
    expect(sortRecentFilings(singleFiling)).toEqual(singleFiling);
    expect(sortRecentFilings(singleFiling, 'filedDate', 'desc')).toEqual(
      singleFiling,
    );
  });

  describe('Sort by different fields', () => {
    const sortTests = [
      {
        field: 'filedDate' as SortableField,
        order: 'asc' as const,
        expected: [TEST_DATES.EARLY, TEST_DATES.MIDDLE, TEST_DATES.LATE],
        property: 'filedDate',
      },
      {
        field: 'docketNumber' as SortableField,
        order: 'asc' as const,
        expected: ['101-20', '102-20', '103-20'],
        property: 'docketNumber',
      },
      {
        field: 'docketNumber' as SortableField,
        order: 'desc' as const,
        expected: ['103-20', '102-20', '101-20'],
        property: 'docketNumber',
      },
      {
        field: 'document' as SortableField,
        order: 'asc' as const,
        expected: [
          TEST_DOCUMENTS.ANSWER,
          TEST_DOCUMENTS.MOTION,
          TEST_DOCUMENTS.PETITION,
        ],
        property: 'document',
      },
      {
        field: 'document' as SortableField,
        order: 'desc' as const,
        expected: [
          TEST_DOCUMENTS.PETITION,
          TEST_DOCUMENTS.MOTION,
          TEST_DOCUMENTS.ANSWER,
        ],
        property: 'document',
      },
      {
        field: 'caseTitle' as SortableField,
        order: 'asc' as const,
        expected: [
          TEST_CASE_TITLES.CASE_1,
          TEST_CASE_TITLES.CASE_2,
          TEST_CASE_TITLES.CASE_3,
        ],
        property: 'caseTitle',
      },
      {
        field: 'caseTitle' as SortableField,
        order: 'desc' as const,
        expected: [
          TEST_CASE_TITLES.CASE_3,
          TEST_CASE_TITLES.CASE_2,
          TEST_CASE_TITLES.CASE_1,
        ],
        property: 'caseTitle',
      },
    ];

    it.each(sortTests)(
      'should sort by $field $order correctly',
      ({ field, order, expected, property }) => {
        const result = sortRecentFilings(mockFilings, field, order);
        expected.forEach((value, index) => {
          expect(result[index][property as keyof RecentFiling]).toBe(value);
        });
      },
    );
  });

  it('should use filedDate as secondary sort when primary sort results in tie', () => {
    const filingsWithSameDocument: RecentFiling[] = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.MOTION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '1',
      },
      {
        docketNumber: '102-20',
        filedDate: TEST_DATES.EARLY,
        document: TEST_DOCUMENTS.MOTION,
        caseTitle: TEST_CASE_TITLES.CASE_2,
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(
      filingsWithSameDocument,
      'document',
      'asc',
    );
    expect(result[0].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(result[1].filedDate).toBe(TEST_DATES.EARLY);
  });

  it('should handle filings with missing/null values', () => {
    const filingsWithMissingFields: RecentFiling[] = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: '',
        caseTitle: '',
        docketEntryId: '1',
      },
      {
        docketNumber: '102-20',
        filedDate: TEST_DATES.EARLY,
        document: TEST_DOCUMENTS.ANSWER,
        caseTitle: TEST_CASE_TITLES.CASE_2,
        docketEntryId: '2',
      },
      {
        docketNumber: '103-20',
        filedDate: TEST_DATES.LATE,
        document: null as unknown as string,
        caseTitle: null as unknown as string,
        docketEntryId: '3',
      },
    ];

    const result = sortRecentFilings(
      filingsWithMissingFields,
      'document',
      'asc',
    );
    expect(result[0].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
    expect(result[1].docketNumber).toBe('102-20');
    expect(result[2].docketNumber).toBe('103-20');
  });

  it('should handle case-insensitive sorting for document and caseTitle fields', () => {
    const filingsWithMixedCase: RecentFiling[] = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: 'petition',
        caseTitle: 'test case 1',
        docketEntryId: '1',
      },
      {
        docketNumber: '102-20',
        filedDate: TEST_DATES.EARLY,
        document: TEST_DOCUMENTS.ANSWER,
        caseTitle: TEST_CASE_TITLES.CASE_2,
        docketEntryId: '2',
      },
      {
        docketNumber: '103-20',
        filedDate: TEST_DATES.LATE,
        document: 'MOTION',
        caseTitle: 'TEST CASE 3',
        docketEntryId: '3',
      },
    ];

    const documentResult = sortRecentFilings(
      filingsWithMixedCase,
      'document',
      'asc',
    );
    expect(documentResult[0].document).toBe(TEST_DOCUMENTS.ANSWER);
    expect(documentResult[1].document).toBe('MOTION');
    expect(documentResult[2].document).toBe('petition');

    const caseTitleResult = sortRecentFilings(
      filingsWithMixedCase,
      'caseTitle',
      'asc',
    );
    expect(caseTitleResult[0].caseTitle).toBe('test case 1');
    expect(caseTitleResult[1].caseTitle).toBe(TEST_CASE_TITLES.CASE_2);
    expect(caseTitleResult[2].caseTitle).toBe('TEST CASE 3');
  });

  it('should handle identical values with secondary sort', () => {
    const filingsWithIdenticalValues = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '1',
      },
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(
      filingsWithIdenticalValues,
      'document',
      'asc',
    );
    expect(result[0].docketEntryId).toBe('1');
    expect(result[1].docketEntryId).toBe('2');
  });

  describe('Parameter validation and defaults', () => {
    it('should handle undefined/null sort parameters by using defaults', () => {
      const undefinedFieldResult = sortRecentFilings(
        mockFilings,
        undefined as unknown as SortableField,
        'desc',
      );
      const nullFieldResult = sortRecentFilings(
        mockFilings,
        null as unknown as SortableField,
        'desc',
      );
      const undefinedOrderResult = sortRecentFilings(
        mockFilings,
        'filedDate',
        undefined as unknown as 'asc' | 'desc',
      );
      const nullOrderResult = sortRecentFilings(
        mockFilings,
        'filedDate',
        null as unknown as 'asc' | 'desc',
      );

      expect(undefinedFieldResult[0].filedDate).toBe(TEST_DATES.LATE);
      expect(nullFieldResult[0].filedDate).toBe(TEST_DATES.LATE);
      expect(undefinedOrderResult[0].filedDate).toBe(TEST_DATES.LATE);
      expect(nullOrderResult[0].filedDate).toBe(TEST_DATES.LATE);
    });

    it('should handle invalid sort parameters by using defaults', () => {
      const invalidFieldResult = sortRecentFilings(
        mockFilings,
        'invalidField' as unknown as SortableField,
        'desc',
      );
      const invalidOrderResult = sortRecentFilings(
        mockFilings,
        'filedDate',
        'invalid' as 'asc' | 'desc',
      );

      expect(invalidFieldResult[0].filedDate).toBe(TEST_DATES.LATE);
      expect(invalidOrderResult[0].filedDate).toBe(TEST_DATES.LATE);
    });
  });

  describe('Docket number sorting edge cases', () => {
    it('should handle docket numbers that cannot be parsed by Case.getSortableDocketNumber', () => {
      const filingsWithInvalidDocketNumbers: RecentFiling[] = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.INVALID_1,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: TEST_DOCKET_NUMBERS.INVALID_2,
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(
        filingsWithInvalidDocketNumbers,
        'docketNumber',
        'asc',
      );

      expect(result[0].docketNumber).toBe(TEST_DOCKET_NUMBERS.INVALID_2);
      expect(result[1].docketNumber).toBe(TEST_DOCKET_NUMBERS.INVALID_1);
      expect(result[2].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
    });

    it('should handle mixed valid and invalid docket numbers', () => {
      const filingsWithMixedDocketNumbers: RecentFiling[] = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: TEST_DOCKET_NUMBERS.INVALID_1,
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
      ];

      const result = sortRecentFilings(
        filingsWithMixedDocketNumbers,
        'docketNumber',
        'asc',
      );

      expect(result[0].docketNumber).toBe(TEST_DOCKET_NUMBERS.INVALID_1);
      expect(result[1].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
    });
  });

  describe('Document field null handling', () => {
    it('should handle null document values correctly in sorting', () => {
      const filingsWithNullDocuments: RecentFiling[] = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: null as unknown as string,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: null as unknown as string,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(
        filingsWithNullDocuments,
        'document',
        'asc',
      );

      expect(result[0].document).toBe(TEST_DOCUMENTS.ANSWER);
      expect(result[1].document).toBeNull();
      expect(result[2].document).toBeNull();
    });

    it('should handle mixed null and non-null document values', () => {
      const filingsWithMixedDocuments: RecentFiling[] = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: null as unknown as string,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(
        filingsWithMixedDocuments,
        'document',
        'asc',
      );

      expect(result[0].document).toBe(TEST_DOCUMENTS.MOTION);
      expect(result[1].document).toBe(TEST_DOCUMENTS.PETITION);
      expect(result[2].document).toBeNull();
    });
  });

  describe('Default case handling', () => {
    it('should handle unknown sort fields with default string comparison', () => {
      const filingsWithExtraFields: ExtendedRecentFiling[] = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
          extraField: TEST_EXTRA_FIELDS.ZEBRA,
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
          extraField: TEST_EXTRA_FIELDS.ALPHA,
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
          extraField: TEST_EXTRA_FIELDS.BETA,
        },
      ];

      const result = sortRecentFilings(
        filingsWithExtraFields,
        'extraField' as unknown as SortableField,
        'asc',
      );

      expect((result[0] as ExtendedRecentFiling).extraField).toBe(
        TEST_EXTRA_FIELDS.ALPHA,
      );
      expect((result[1] as ExtendedRecentFiling).extraField).toBe(
        TEST_EXTRA_FIELDS.ZEBRA,
      );
      expect((result[2] as ExtendedRecentFiling).extraField).toBe(
        TEST_EXTRA_FIELDS.BETA,
      );
    });

    it('should handle undefined field values in default case', () => {
      const filingsWithUndefinedFields: ExtendedRecentFiling[] = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
          extraField: undefined,
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
          extraField: TEST_EXTRA_FIELDS.ALPHA,
        },
      ];

      const result = sortRecentFilings(
        filingsWithUndefinedFields,
        'extraField' as unknown as SortableField,
        'asc',
      );

      expect((result[0] as ExtendedRecentFiling).extraField).toBe(
        TEST_EXTRA_FIELDS.ALPHA,
      );
      expect((result[1] as ExtendedRecentFiling).extraField).toBeUndefined();
    });


  });

  describe('FiledDate sorting optimization', () => {
    it('should use optimized sorting for filedDate descending', () => {
      const filings = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(filings, 'filedDate', 'desc');

      expect(result[0].filedDate).toBe(TEST_DATES.LATE);
      expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
      expect(result[2].filedDate).toBe(TEST_DATES.EARLY);
    });

    it('should not use optimized sorting for filedDate ascending', () => {
      const filings = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(filings, 'filedDate', 'asc');

      expect(result[0].filedDate).toBe(TEST_DATES.EARLY);
      expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
      expect(result[2].filedDate).toBe(TEST_DATES.LATE);
    });

    it('should use optimized sorting for default filedDate descending', () => {
      const filings = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(filings);

      expect(result[0].filedDate).toBe(TEST_DATES.LATE);
      expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
      expect(result[2].filedDate).toBe(TEST_DATES.EARLY);
    });

    it('should handle identical filedDate values in optimized sorting', () => {
      const filings = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.MIDDLE, // Same date
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
        {
          docketNumber: '103-20',
          filedDate: TEST_DATES.LATE,
          document: TEST_DOCUMENTS.MOTION,
          caseTitle: TEST_CASE_TITLES.CASE_3,
          docketEntryId: '3',
        },
      ];

      const result = sortRecentFilings(filings, 'filedDate', 'desc');

      expect(result[0].filedDate).toBe(TEST_DATES.LATE);
      expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
      expect(result[2].filedDate).toBe(TEST_DATES.MIDDLE);
      // Should maintain original order for identical dates
      expect(result[1].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
      expect(result[2].docketNumber).toBe('102-20');
    });

    it('should handle unknown sort field with default case', () => {
      const filings = [
        {
          docketNumber: TEST_DOCKET_NUMBERS.VALID,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: '102-20',
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
      ];

      const result = sortRecentFilings(
        filings,
        'unknownField' as any,
        'asc',
      );

      // Should fall back to filedDate sorting when unknown field is provided
      expect(result[0].filedDate).toBe(TEST_DATES.EARLY);
      expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
    });
  });
});
