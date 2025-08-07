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

const SHARED_FILINGS: RecentFiling[] = [
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

describe('sortRecentFilings', () => {
  it('should handle basic functionality and edge cases', () => {
    expect(sortRecentFilings([])).toEqual([]);
    expect(sortRecentFilings(null as unknown as RecentFiling[])).toEqual([]);
    expect(sortRecentFilings(undefined as unknown as RecentFiling[])).toEqual(
      [],
    );

    const singleFiling = [SHARED_FILINGS[0]];
    expect(sortRecentFilings(singleFiling)).toEqual(singleFiling);

    const result = sortRecentFilings(SHARED_FILINGS);
    expect(result[0].filedDate).toBe(TEST_DATES.LATE);
    expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(result[2].filedDate).toBe(TEST_DATES.EARLY);
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
        const result = sortRecentFilings(SHARED_FILINGS, field, order);
        expected.forEach((value, index) => {
          expect(result[index][property as keyof RecentFiling]).toBe(value);
        });
      },
    );
  });

  it('should handle edge cases and special scenarios', () => {
    const filingsWithSameDocument = [
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

    const filingsWithMissingFields = [
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

    const missingResult = sortRecentFilings(
      filingsWithMissingFields,
      'document',
      'asc',
    );
    expect(missingResult[0].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
    expect(missingResult[1].docketNumber).toBe('102-20');
    expect(missingResult[2].docketNumber).toBe('103-20');
  });

  it('should handle case-insensitive sorting and mixed case scenarios', () => {
    const filingsWithMixedCase = [
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

  it('should handle identical values and secondary sorting', () => {
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

    const identicalDates = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '1',
      },
      {
        docketNumber: '102-20',
        filedDate: TEST_DATES.MIDDLE,
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

    const dateResult = sortRecentFilings(identicalDates, 'filedDate', 'desc');
    expect(dateResult[0].filedDate).toBe(TEST_DATES.LATE);
    expect(dateResult[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(dateResult[2].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(dateResult[1].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
    expect(dateResult[2].docketNumber).toBe('102-20');
  });

  it('should handle parameter validation and defaults', () => {
    const undefinedFieldResult = sortRecentFilings(
      SHARED_FILINGS,
      undefined as unknown as SortableField,
      'desc',
    );
    const nullFieldResult = sortRecentFilings(
      SHARED_FILINGS,
      null as unknown as SortableField,
      'desc',
    );
    const invalidFieldResult = sortRecentFilings(
      SHARED_FILINGS,
      'invalidField' as unknown as SortableField,
      'desc',
    );
    const invalidOrderResult = sortRecentFilings(
      SHARED_FILINGS,
      'filedDate',
      'invalid' as 'asc' | 'desc',
    );

    expect(undefinedFieldResult[0].filedDate).toBe(TEST_DATES.LATE);
    expect(nullFieldResult[0].filedDate).toBe(TEST_DATES.LATE);
    expect(invalidFieldResult[0].filedDate).toBe(TEST_DATES.LATE);
    expect(invalidOrderResult[0].filedDate).toBe(TEST_DATES.LATE);
  });

  it('should handle docket number sorting edge cases', () => {
    const filingsWithInvalidDocketNumbers = [
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

    const mixedDocketNumbers = [
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

    const mixedResult = sortRecentFilings(
      mixedDocketNumbers,
      'docketNumber',
      'asc',
    );
    expect(mixedResult[0].docketNumber).toBe(TEST_DOCKET_NUMBERS.INVALID_1);
    expect(mixedResult[1].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
  });

  it('should handle document field null handling and edge cases', () => {
    const filingsWithNullDocuments = [
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

    const filingsWithEmptyDocument = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: '',
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

    const emptyResult = sortRecentFilings(
      filingsWithEmptyDocument,
      'document',
      'asc',
    );
    expect(emptyResult[0].document).toBe('');
    expect(emptyResult[1].document).toBe(TEST_DOCUMENTS.ANSWER);
  });

  it('should handle default case and unknown sort fields', () => {
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

    const undefinedResult = sortRecentFilings(
      filingsWithUndefinedFields,
      'extraField' as unknown as SortableField,
      'asc',
    );
    expect((undefinedResult[0] as ExtendedRecentFiling).extraField).toBe(
      TEST_EXTRA_FIELDS.ALPHA,
    );
    expect(
      (undefinedResult[1] as ExtendedRecentFiling).extraField,
    ).toBeUndefined();

    const unknownFieldResult = sortRecentFilings(
      SHARED_FILINGS,
      'unknownField' as any,
      'asc',
    );
    expect(unknownFieldResult[0].filedDate).toBe(TEST_DATES.EARLY);
    expect(unknownFieldResult[1].filedDate).toBe(TEST_DATES.MIDDLE);
  });

  it('should handle filedDate sorting optimization and special cases', () => {
    const result = sortRecentFilings(SHARED_FILINGS, 'filedDate', 'desc');
    expect(result[0].filedDate).toBe(TEST_DATES.LATE);
    expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(result[2].filedDate).toBe(TEST_DATES.EARLY);

    const ascResult = sortRecentFilings(SHARED_FILINGS, 'filedDate', 'asc');
    expect(ascResult[0].filedDate).toBe(TEST_DATES.EARLY);
    expect(ascResult[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(ascResult[2].filedDate).toBe(TEST_DATES.LATE);

    const defaultResult = sortRecentFilings(SHARED_FILINGS);
    expect(defaultResult[0].filedDate).toBe(TEST_DATES.LATE);
    expect(defaultResult[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(defaultResult[2].filedDate).toBe(TEST_DATES.EARLY);

    const invalidDocketResult = sortRecentFilings(
      [
        {
          docketNumber: TEST_DOCKET_NUMBERS.INVALID_1,
          filedDate: TEST_DATES.MIDDLE,
          document: TEST_DOCUMENTS.PETITION,
          caseTitle: TEST_CASE_TITLES.CASE_1,
          docketEntryId: '1',
        },
        {
          docketNumber: TEST_DOCKET_NUMBERS.INVALID_2,
          filedDate: TEST_DATES.EARLY,
          document: TEST_DOCUMENTS.ANSWER,
          caseTitle: TEST_CASE_TITLES.CASE_2,
          docketEntryId: '2',
        },
      ],
      'docketNumber',
      'asc',
    );

    expect(invalidDocketResult[0].docketNumber).toBe(
      TEST_DOCKET_NUMBERS.INVALID_1,
    );
    expect(invalidDocketResult[1].docketNumber).toBe(
      TEST_DOCKET_NUMBERS.INVALID_2,
    );
  });

  it('should handle unknown sort fields and fallback comparisons', () => {
    const filingsWithEqualValues = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '1',
      },
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.EARLY,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(filingsWithEqualValues, 'document', 'asc');
    expect(result[0].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(result[1].filedDate).toBe(TEST_DATES.EARLY);

    const unknownFieldResult = sortRecentFilings(
      SHARED_FILINGS,
      'unknownField' as any,
      'asc',
    );
    expect(unknownFieldResult[0].filedDate).toBe(TEST_DATES.EARLY);
    expect(unknownFieldResult[1].filedDate).toBe(TEST_DATES.MIDDLE);
    expect(unknownFieldResult[2].filedDate).toBe(TEST_DATES.LATE);
  });

  it('should handle default case with unknown field and fallback comparison', () => {
    const filingsWithEqualValues = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '1',
      },
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.EARLY,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: TEST_CASE_TITLES.CASE_1,
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(
      filingsWithEqualValues,
      'unknownField' as any,
      'asc',
    );
    expect(result[0].filedDate).toBe(TEST_DATES.EARLY);
    expect(result[1].filedDate).toBe(TEST_DATES.MIDDLE);
  });

  it('should handle default case with completely equal values triggering fallback', () => {
    const filingsWithCompletelyEqualValues = [
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
      filingsWithCompletelyEqualValues,
      'unknownField' as any,
      'asc',
    );
    expect(result[0].docketEntryId).toBe('1');
    expect(result[1].docketEntryId).toBe('2');
  });

  it('should handle default case with completely equal values and fallback comparison', () => {
    const filingsWithCompletelyEqualValues = [
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
      filingsWithCompletelyEqualValues,
      'unknownField' as any,
      'asc',
    );
    expect(result[0].docketEntryId).toBe('1');
    expect(result[1].docketEntryId).toBe('2');
  });

  it('should handle fallback comparison when values are equal for non-filedDate field', () => {
    const filingsWithEqualCaseTitles = [
      {
        docketNumber: TEST_DOCKET_NUMBERS.VALID,
        filedDate: TEST_DATES.MIDDLE,
        document: TEST_DOCUMENTS.PETITION,
        caseTitle: 'Same Case Title',
        docketEntryId: '1',
      },
      {
        docketNumber: '102-20',
        filedDate: TEST_DATES.EARLY,
        document: TEST_DOCUMENTS.ANSWER,
        caseTitle: 'Same Case Title',
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(
      filingsWithEqualCaseTitles,
      'caseTitle',
      'desc',
    );
    expect(result[0].docketNumber).toBe('102-20');
    expect(result[1].docketNumber).toBe(TEST_DOCKET_NUMBERS.VALID);
  });
});
