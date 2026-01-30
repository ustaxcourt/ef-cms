import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import {
  CONTACT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { addCoverToPdf } from './addCoverToPdf';
import { addCoversheetInteractor } from './addCoversheetInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  getCasesByDocketNumbers as getCasesByDocketNumbersMock,
  OmittableCaseFields,
} from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

jest.mock('./addCoverToPdf', () => ({
  __esModule: true,
  addCoverToPdf: jest
    .fn()
    .mockImplementation(jest.requireActual('./addCoverToPdf').addCoverToPdf),
}));

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getCasesByDocketNumbers =
  getCasesByDocketNumbersMock as jest.MockedFunction<
    (args: {
      docketNumbers: string[];
      excludeFields?: OmittableCaseFields[];
    }) => Promise<Omit<RawCase, 'consolidatedCases'>[]>
  >;
  const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);

describe('addCoversheetInteractor', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;

  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
    ],
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    docketEntries: [
      {
        ...testingCaseData.docketEntries[0],
        addToCoversheet: true,
        additionalInfo: 'Additional Info Something',
        certificateOfService: true,
        certificateOfServiceDate: '2019-04-20T05:00:00.000Z',
        docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        docketNumber: '102-19',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        eventCode: 'M008',
        filedBy: 'Test Petitioner1',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
        objections: OBJECTIONS_OPTIONS_MAP.NO,
      },
    ],
    docketNumber: '102-19',
    partyType: PARTY_TYPES.petitionerSpouse,
    petitioners: [
      {
        contactType: CONTACT_TYPES.primary,
        name: 'Janie Petitioner',
      },
      {
        contactType: CONTACT_TYPES.secondary,
        name: 'Janie Petitioner',
      },
    ],
  };

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(testingCaseData);
    getCasesByDocketNumbers.mockResolvedValue([testingCaseData]);
  });

  it('adds a cover page to a pdf document', async () => {
    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('replaces the cover page on a document', async () => {
    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        replaceCoversheet: true,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it("updates the docket entry's page numbers", async () => {
    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(upsertDocketEntries).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    getCaseByDocketNumber.mockResolvedValue(optionalTestingCaseData);

    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('returns the updated docket entry entity', async () => {
    const updatedDocketEntryEntity = await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(updatedDocketEntryEntity).toMatchObject({
      numberOfPages: 2,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });
  });

  it('should call getCaseByDocketNumber to retrieve case entity if it is not passed in', async () => {
    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber.mock.calls[0][0].docketNumber).toBe(
      MOCK_CASE.docketNumber,
    );
  });

  it('should not call getCaseByDocketNumber if case entity is passed in', async () => {
    await addCoversheetInteractor(
      applicationContext,
      {
        caseEntity: new Case(testingCaseData, {
          authorizedUser: mockDocketClerkUser,
        }),
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('updates only the page numbers for the docket entires existing in the consolidated group case docket record', async () => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: [
        {
          docketNumber: '101-19',
          documentNumber: null,
        },
        {
          docketNumber: '102-20',
          documentNumber: 2,
        },
        {
          docketNumber: '103-20',
          documentNumber: 5,
        },
      ],
      numberOfPages: 5,
      pdfData: 'gg',
    });
    getCasesByDocketNumbers.mockResolvedValueOnce([
      {
        ...testingCaseData,
        docketNumber: '102-20',
        docketEntries: [
          { ...MOCK_CASE.docketEntries[0], docketNumber: '102-20' },
        ],
      },
      {
        ...testingCaseData,
        docketNumber: '103-20',
        docketEntries: [
          { ...MOCK_CASE.docketEntries[0], docketNumber: '103-20' },
        ],
      },
    ]);

    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(upsertDocketEntries).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ docketNumber: '102-20' }),
        expect.objectContaining({ docketNumber: '103-20' }),
      ]),
    );
  });

  it('works as expected when feature flag is off and consolidated cases returns null', async () => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: null,
      numberOfPages: 5,
      pdfData: 'gg',
    });

    await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(upsertDocketEntries).toHaveBeenCalledTimes(1);

    const calls = upsertDocketEntries.mock.calls.map(call => ({
      docketNumber: call[0][0].docketNumber,
      numberOfPages: call[0][0].numberOfPages,
    }));

    const firstCase = calls.find(
      call => call.docketNumber === MOCK_CASE.docketNumber,
    );

    expect(firstCase).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      numberOfPages: 5,
    });
  });

  it('should not update the processing status of a non-subject case, simultaneous doc type docket entry entity on a consolidated case', async () => {
    const mockProcessingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING;
    const mockConsolidatedCaseNonSubjectCase = '102-20';
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: [
        {
          docketNumber: mockConsolidatedCaseNonSubjectCase,
          documentNumber: 2,
        },
      ],
    });

    getCasesByDocketNumbers.mockResolvedValueOnce([
      {
        ...testingCaseData,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            createdAt: '2019-04-19T14:45:15.595Z',
            documentType: 'Simultaneous Answering Brief',
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
            processingStatus: mockProcessingStatus,
            docketNumber: '102-20',
          },
        ],
        docketNumber: mockConsolidatedCaseNonSubjectCase,
      },
    ]);

    await addCoversheetInteractor(
      applicationContext,
      {
        caseEntity: new Case(
          {
            ...testingCaseData,
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          },
          { authorizedUser: mockDocketClerkUser },
        ),
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(upsertDocketEntries.mock.calls[0][0]).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: mockConsolidatedCaseNonSubjectCase,
          processingStatus: mockProcessingStatus,
        }),
      ]),
    );
  });

  it('should not update the processing status of a non-subject case, simultaneous document title docket entry entity on a consolidated case', async () => {
    const mockProcessingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING;
    const mockConsolidatedCaseNonSubjectCase = '102-20';
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      consolidatedCases: [
        {
          docketNumber: mockConsolidatedCaseNonSubjectCase,
          documentNumber: 2,
        },
      ],
    });

    getCasesByDocketNumbers.mockResolvedValueOnce([
      {
        ...testingCaseData,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            createdAt: '2019-04-19T14:45:15.595Z',
            documentTitle: 'Super Duper Simultaneous but not really',
            documentType: 'Answer',
            processingStatus: mockProcessingStatus,
            docketNumber: '102-20',
          },
        ],
        docketNumber: mockConsolidatedCaseNonSubjectCase,
      },
    ]);

    await addCoversheetInteractor(
      applicationContext,
      {
        caseEntity: new Case(
          {
            ...testingCaseData,
            documentTitle: 'Super Duper Simultaneous but not really',
          },
          { authorizedUser: mockDocketClerkUser },
        ),
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      } as any,
      mockDocketClerkUser,
    );

    expect(upsertDocketEntries.mock.calls[0][0]).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: mockConsolidatedCaseNonSubjectCase,
          processingStatus: mockProcessingStatus,
        }),
      ]),
    );
  });
});
