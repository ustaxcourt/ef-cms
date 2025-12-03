import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import { CourtIssuedDocumentAnyType } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { addAssociatedDocketEntries } from '@web-api/business/useCaseHelper/docketEntry/addAssociatedDocketEntries';
import { upsertDocketEntryRelatedEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntryRelatedEntries';
import { MOCK_CASE } from '@shared/test/mockCase';

describe('addAssociatedDocketEntries', () => {
  it(`should call upsertDocketEntryRelatedEntries for a single docket entry`, async () => {
    await addAssociatedDocketEntries(
      [
        {
          ...MOCK_CASE,
          docketNumber: '101-18',
          docketEntries: [
            { docketEntryId: 'uuid-1' },
            { docketEntryId: 'uuid-2' },
          ],
        },
      ] as RawCase[],
      {
        affectedDocketEntries: [
          { docketEntryId: 'uuid-2', disposition: 'GRANTED' },
        ],
      } as CourtIssuedDocumentAnyType,
      { docketEntryId: 'uuid-1' } as DocketEntry,
      false,
    );

    expect(upsertDocketEntryRelatedEntries).toHaveBeenCalledWith({
      motionDocketEntries: [
        {
          disposition: 'GRANTED',
          docketEntryId: 'uuid-2',
          docketNumber: '101-18',
        },
      ],
      orderDocketEntry: expect.objectContaining({
        docketEntryId: 'uuid-1',
      }),
      served: false,
    });
  });

  it(`should call upsertDocketEntryRelatedEntries for several docket entries in one case`, async () => {
    await addAssociatedDocketEntries(
      [
        {
          ...MOCK_CASE,
          docketNumber: '101-18',
          docketEntries: [
            { docketEntryId: 'uuid-1' },
            { docketEntryId: 'uuid-2' },
            { docketEntryId: 'uuid-3' },
            { docketEntryId: 'uuid-4' },
          ],
        },
      ] as RawCase[],
      {
        affectedDocketEntries: [
          { docketEntryId: 'uuid-2', disposition: 'GRANTED' },
          { docketEntryId: 'uuid-3', disposition: 'DENIED' },
          { docketEntryId: 'uuid-4', disposition: 'GRANTED IN PART' },
        ],
      } as CourtIssuedDocumentAnyType,
      { docketEntryId: 'uuid-1' } as DocketEntry,
      false,
    );

    expect(upsertDocketEntryRelatedEntries).toHaveBeenCalledWith({
      motionDocketEntries: [
        {
          disposition: 'GRANTED',
          docketEntryId: 'uuid-2',
          docketNumber: '101-18',
        },
        {
          disposition: 'DENIED',
          docketEntryId: 'uuid-3',
          docketNumber: '101-18',
        },
        {
          disposition: 'GRANTED IN PART',
          docketEntryId: 'uuid-4',
          docketNumber: '101-18',
        },
      ],
      orderDocketEntry: expect.objectContaining({
        docketEntryId: 'uuid-1',
      }),
      served: false,
    });
  });

  it(`should call upsertDocketEntryRelatedEntries for multiple cases with some matching docket entries`, async () => {
    await addAssociatedDocketEntries(
      [
        {
          // Has all affected documents
          ...MOCK_CASE,
          docketNumber: '101-18',
          docketEntries: [
            { docketEntryId: 'uuid-1' },
            { docketEntryId: 'uuid-2' },
            { docketEntryId: 'uuid-3' },
            { docketEntryId: 'uuid-4' },
          ],
        },
        {
          // Has two affected documents
          ...MOCK_CASE,
          docketNumber: '101-19',
          docketEntries: [
            { docketEntryId: 'uuid-1' },
            { docketEntryId: 'uuid-3' },
            { docketEntryId: 'uuid-4' },
          ],
        },
        {
          // Has two affected documents - with one different
          ...MOCK_CASE,
          docketNumber: '101-20',
          docketEntries: [
            { docketEntryId: 'uuid-1' },
            { docketEntryId: 'uuid-2' },
            { docketEntryId: 'uuid-4' },
          ],
        },
        {
          // No affected documents
          ...MOCK_CASE,
          docketNumber: '101-21',
          docketEntries: [
            { docketEntryId: 'uuid-6' },
            { docketEntryId: 'uuid-7' },
          ],
        },
      ] as RawCase[],
      {
        affectedDocketEntries: [
          { docketEntryId: 'uuid-2', disposition: 'GRANTED' },
          { docketEntryId: 'uuid-3', disposition: 'DENIED' },
          { docketEntryId: 'uuid-4', disposition: 'GRANTED IN PART' },
        ],
      } as CourtIssuedDocumentAnyType,
      { docketEntryId: 'uuid-1' } as DocketEntry,
      false,
    );

    expect(upsertDocketEntryRelatedEntries).toHaveBeenCalledWith({
      motionDocketEntries: [
        {
          disposition: 'GRANTED',
          docketEntryId: 'uuid-2',
          docketNumber: '101-18',
        },
        {
          disposition: 'DENIED',
          docketEntryId: 'uuid-3',
          docketNumber: '101-18',
        },
        {
          disposition: 'GRANTED IN PART',
          docketEntryId: 'uuid-4',
          docketNumber: '101-18',
        },
        {
          disposition: 'DENIED',
          docketEntryId: 'uuid-3',
          docketNumber: '101-19',
        },
        {
          disposition: 'GRANTED IN PART',
          docketEntryId: 'uuid-4',
          docketNumber: '101-19',
        },
        {
          disposition: 'GRANTED',
          docketEntryId: 'uuid-2',
          docketNumber: '101-20',
        },
        {
          disposition: 'GRANTED IN PART',
          docketEntryId: 'uuid-4',
          docketNumber: '101-20',
        },
      ],
      orderDocketEntry: expect.objectContaining({
        docketEntryId: 'uuid-1',
      }),
      served: false,
    });
  });
});
