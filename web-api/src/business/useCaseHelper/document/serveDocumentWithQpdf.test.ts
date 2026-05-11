import '@web-api/persistence/postgres/cases/mocks.jest';

jest.mock('@web-api/utilities/qpdf', () => ({
  qpdfMerge: jest.fn().mockResolvedValue(undefined),
  qpdfPageCount: jest.fn().mockResolvedValue(940),
}));

jest.mock('@web-api/business/useCases/generateCoverSheetData', () => ({
  generateCoverSheetData: jest.fn(),
}));

jest.mock('@web-api/persistence/postgres/docketEntries/upsertDocketEntries', () => ({
  upsertDocketEntries: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(Buffer.from('mock-bytes')),
}));

jest.mock('@shared/business/utilities/aggregatePartiesForService', () => ({
  aggregatePartiesForService: jest.fn(),
}));

import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_PETITION } from '@shared/test/mockDocketEntry';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import {
  prependCoversheetWithQpdfAndPersist,
  runPaperServiceWithQpdf,
} from './serveDocumentWithQpdf';
import {
  qpdfMerge as qpdfMergeMock,
  qpdfPageCount as qpdfPageCountMock,
} from '@web-api/utilities/qpdf';
import { generateCoverSheetData as generateCoverSheetDataMock } from '@web-api/business/useCases/generateCoverSheetData';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { aggregatePartiesForService as aggregatePartiesForServiceMock } from '@shared/business/utilities/aggregatePartiesForService';

const qpdfMerge = jest.mocked(qpdfMergeMock);
const qpdfPageCount = jest.mocked(qpdfPageCountMock);
const generateCoverSheetData = jest.mocked(generateCoverSheetDataMock);
const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const aggregatePartiesForService = jest.mocked(aggregatePartiesForServiceMock);

const mockWorkDir = '/tmp/serve-xyz';

// Use the project's canonical valid docket-entry fixture so .validate() in
// the orchestrator passes. Override only the storage id so it ties back to
// our test expectations.
const buildSubjectCase = (overrides: Partial<RawCase> = {}) =>
  new Case(
    {
      ...MOCK_CASE,
      docketEntries: [
        { ...MOCK_PETITION, documentStorageId: MOCK_PETITION.docketEntryId },
      ],
      ...overrides,
    },
    { authorizedUser: mockDocketClerkUser },
  );

const buildSubjectDocketEntry = () =>
  new DocketEntry(
    { ...MOCK_PETITION, documentStorageId: MOCK_PETITION.docketEntryId },
    { authorizedUser: mockDocketClerkUser },
  );

describe('prependCoversheetWithQpdfAndPersist', () => {
  beforeEach(() => {
    qpdfMerge.mockClear();
    qpdfPageCount.mockResolvedValue(940);
    upsertDocketEntries.mockClear();
    generateCoverSheetData.mockResolvedValue({ caseTitle: 'fake' } as any);
    getCasesByDocketNumbers.mockResolvedValue([
      {
        ...MOCK_CASE,
        docketEntries: [
          { ...MOCK_PETITION, documentStorageId: MOCK_PETITION.docketEntryId },
        ],
      },
    ]);
  });

  it('runs qpdf to prepend the generated coversheet onto the original in cover→original order', async () => {
    await prependCoversheetWithQpdfAndPersist({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseEntity: buildSubjectCase(),
      docketEntryEntity: buildSubjectDocketEntry(),
      documentStorageId: MOCK_PETITION.docketEntryId!,
      originalPdfPath: `${mockWorkDir}/orig.pdf`,
      workDir: mockWorkDir,
    });

    expect(qpdfMerge).toHaveBeenCalledTimes(1);
    expect(qpdfMerge.mock.calls[0][0]).toMatchObject({
      inputs: [`${mockWorkDir}/cover.pdf`, `${mockWorkDir}/orig.pdf`],
      output: `${mockWorkDir}/with-cover.pdf`,
    });
  });

  it('uploads the cover-attached PDF back to S3 at the original documentStorageId', async () => {
    await prependCoversheetWithQpdfAndPersist({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseEntity: buildSubjectCase(),
      docketEntryEntity: buildSubjectDocketEntry(),
      documentStorageId: MOCK_PETITION.docketEntryId!,
      originalPdfPath: `${mockWorkDir}/orig.pdf`,
      workDir: mockWorkDir,
    });

    const saveDocumentFromLambda = applicationContext.getPersistenceGateway()
      .saveDocumentFromLambda as jest.Mock;
    expect(saveDocumentFromLambda).toHaveBeenCalledWith(
      expect.objectContaining({ key: MOCK_PETITION.docketEntryId }),
    );
  });

  it('upserts the subject case docket entry with COMPLETE status and the qpdf-derived page count when no consolidated cases are present', async () => {
    qpdfPageCount.mockResolvedValueOnce(2534);

    await prependCoversheetWithQpdfAndPersist({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseEntity: buildSubjectCase(),
      docketEntryEntity: buildSubjectDocketEntry(),
      documentStorageId: MOCK_PETITION.docketEntryId!,
      originalPdfPath: `${mockWorkDir}/orig.pdf`,
      workDir: mockWorkDir,
    });

    expect(upsertDocketEntries).toHaveBeenCalledTimes(1);
    const upsertedEntries = upsertDocketEntries.mock.calls[0][0];
    expect(upsertedEntries).toHaveLength(1);
    expect(upsertedEntries[0]).toMatchObject({
      docketEntryId: MOCK_PETITION.docketEntryId,
      numberOfPages: 2534,
      processingStatus: 'complete',
    });
  });

  it('fans the docket-entry upsert across consolidated cases when coverSheetData carries a consolidatedCases list', async () => {
    generateCoverSheetData.mockResolvedValue({
      caseTitle: 'fake',
      consolidatedCases: [
        { docketNumber: MOCK_CASE.docketNumber, documentNumber: 1 },
        { docketNumber: '888-20', documentNumber: 1 },
      ],
    } as any);
    getCasesByDocketNumbers.mockResolvedValue([
      {
        ...MOCK_CASE,
        docketEntries: [
          { ...MOCK_PETITION, documentStorageId: MOCK_PETITION.docketEntryId },
        ],
      },
      {
        ...MOCK_CASE,
        docketNumber: '888-20',
        docketEntries: [
          {
            ...MOCK_PETITION,
            docketNumber: '888-20',
            documentStorageId: MOCK_PETITION.docketEntryId,
          },
        ],
      },
    ]);

    await prependCoversheetWithQpdfAndPersist({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseEntity: buildSubjectCase(),
      docketEntryEntity: buildSubjectDocketEntry(),
      documentStorageId: MOCK_PETITION.docketEntryId!,
      originalPdfPath: `${mockWorkDir}/orig.pdf`,
      workDir: mockWorkDir,
    });

    const upsertedEntries = upsertDocketEntries.mock.calls[0][0];
    const docketNumbers = upsertedEntries.map(
      (e: { docketNumber: string }) => e.docketNumber,
    );
    expect(docketNumbers).toEqual(
      expect.arrayContaining([MOCK_CASE.docketNumber, '888-20']),
    );
  });
});

describe('runPaperServiceWithQpdf', () => {
  beforeEach(() => {
    qpdfMerge.mockClear();
    aggregatePartiesForService.mockReset();
    (applicationContext.getUseCaseHelpers().sendServedPartiesEmails as jest.Mock)
      .mockReset()
      .mockResolvedValue(undefined);
    (applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl as jest.Mock)
      .mockReset()
      .mockResolvedValue({ fileId: 'mock-id', url: 'https://example.com/p.pdf' });
  });

  it('sends emails for every case (even those with no paper parties) and returns no pdfUrl when no paper parties exist anywhere', async () => {
    aggregatePartiesForService.mockReturnValue({
      all: [{ email: 'a@test.com', name: 'A' }],
      paper: [],
      electronic: [{ email: 'a@test.com', name: 'A' }],
    });
    const cases = [
      buildSubjectCase({ docketNumber: '101-18' }),
      buildSubjectCase({ docketNumber: '888-20' }),
    ];

    const result = await runPaperServiceWithQpdf({
      applicationContext,
      caseEntities: cases,
      docketEntryId: MOCK_PETITION.docketEntryId!,
      withCoverPath: `${mockWorkDir}/with-cover.pdf`,
      workDir: mockWorkDir,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);
    expect(qpdfMerge).not.toHaveBeenCalled();
    expect(result.pdfUrl).toBeUndefined();
  });

  it('interleaves [address, withCover] per paper party in outer-case/inner-party order and returns the saved bundle URL', async () => {
    aggregatePartiesForService.mockReturnValue({
      all: [{ name: 'Paper Pete', address1: '1 way' }],
      paper: [{ name: 'Paper Pete', address1: '1 way' }],
      electronic: [],
    });
    const cases = [
      buildSubjectCase({ docketNumber: '101-18' }),
      buildSubjectCase({ docketNumber: '888-20' }),
    ];

    const result = await runPaperServiceWithQpdf({
      applicationContext,
      caseEntities: cases,
      docketEntryId: MOCK_PETITION.docketEntryId!,
      withCoverPath: `${mockWorkDir}/with-cover.pdf`,
      workDir: mockWorkDir,
    });

    expect(qpdfMerge).toHaveBeenCalledTimes(1);
    const mergeArgs = qpdfMerge.mock.calls[0][0];
    // For two cases with one paper party each, expect:
    // [addr-0, with-cover, addr-1, with-cover]
    expect(mergeArgs.inputs).toEqual([
      `${mockWorkDir}/addr-0.pdf`,
      `${mockWorkDir}/with-cover.pdf`,
      `${mockWorkDir}/addr-1.pdf`,
      `${mockWorkDir}/with-cover.pdf`,
    ]);
    expect(mergeArgs.output).toBe(`${mockWorkDir}/paper-service.pdf`);
    expect(result.pdfUrl).toBe('https://example.com/p.pdf');
  });
});
