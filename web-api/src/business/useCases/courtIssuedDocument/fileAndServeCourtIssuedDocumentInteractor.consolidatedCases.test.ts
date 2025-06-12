import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase',
);
import {
  DOCKET_SECTION,
  TRANSCRIPT_EVENT_CODE,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { fileAndServeCourtIssuedDocumentInteractor } from './fileAndServeCourtIssuedDocumentInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { v4 as uuidv4 } from 'uuid';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateDocketEntryPendingServiceStatus as updateDocketEntryPendingServiceStatusMock } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus';
import { fileAndServeDocumentOnOneCase as fileAndServeDocumentOnOneCaseMock } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { Case } from '@shared/business/entities/cases/Case';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

const updateDocketEntryPendingServiceStatus = jest.mocked(
  updateDocketEntryPendingServiceStatusMock,
);

describe('consolidated cases', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const fileAndServeDocumentOnOneCase = jest.mocked(
    fileAndServeDocumentOnOneCaseMock,
  );
  const mockPdfUrl = 'www.example.com';
  const mockWorkItem = {
    docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    section: DOCKET_SECTION,
    sentBy: docketClerkUser.name,
    sentByUserId: docketClerkUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const mockDocketEntryWithWorkItem = {
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
    docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    documentTitle: 'Order',
    documentType: 'Order',
    eventCode: 'O',
    signedAt: '2019-03-01T21:40:46.415Z',
    signedByUserId: docketClerkUser.userId,
    signedJudgeName: 'Dredd',
    userId: docketClerkUser.userId,
    workItem: mockWorkItem,
  };

  const clientConnectionId = 'ABC123';

  let leadCaseDocketEntries;
  let consolidatedCase1DocketEntries;

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);

    fileAndServeDocumentOnOneCase.mockResolvedValue(
      new Case(MOCK_LEAD_CASE_WITH_PAPER_SERVICE, {
        authorizedUser: undefined,
      }),
    );

    leadCaseDocketEntries = [
      mockDocketEntryWithWorkItem,
      {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: docketClerkUser.userId,
        signedJudgeName: 'Dredd',
        userId: docketClerkUser.userId,
      },
      {
        docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        userId: docketClerkUser.userId,
      },
    ];

    consolidatedCase1DocketEntries = MOCK_DOCUMENTS.map(docketEntry => {
      return {
        ...docketEntry,
        docketEntryId: uuidv4(),
        docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
      };
    });

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
      switch (docketNumber) {
        case MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber:
          return {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            docketEntries: leadCaseDocketEntries,
          };
        case MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber:
          return {
            ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
            docketEntries: consolidatedCase1DocketEntries,
          };
        default:
          return {
            ...MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
            docketEntries: [],
          };
      }
    });
    getCasesByDocketNumbers.mockImplementation(({ docketNumbers }) => {
      const doStuff = docketNumber => {
        switch (docketNumber) {
          case MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber:
            return {
              ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
              docketEntries: leadCaseDocketEntries,
            } as any;
          case MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber:
            return {
              ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
              docketEntries: consolidatedCase1DocketEntries,
            } as any;
          default:
            return {
              ...MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
              docketEntries: [],
            } as any;
        }
      };

      return Promise.resolve(docketNumbers.map(doStuff));
    });
  });

  it('should set each docketEntry`s pendingStatus to false even when an error occurs while filing the docket entries', async () => {
    const expectedErrorString = 'expected error';
    fileAndServeDocumentOnOneCase
      .mockImplementationOnce(() => undefined as any)
      .mockImplementationOnce(() => undefined as any)
      .mockRejectedValueOnce(new Error(expectedErrorString));

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        {
          clientConnectionId,
          docketEntryId: leadCaseDocketEntries[0].docketEntryId,
          docketNumbers: [
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
          ],
          form: leadCaseDocketEntries[0],
          subjectCaseDocketNumber:
            MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(expectedErrorString);

    const initialCall = 1;
    const finallyBlockCalls = 3;

    expect(updateDocketEntryPendingServiceStatus).toHaveBeenCalledTimes(
      finallyBlockCalls + initialCall,
    );
  });

  it('should log the failure to call updateDocketEntryPendingServiceStatus in the finally block', async () => {
    const expectedErrorString = 'expected error';

    const innerError = new Error(expectedErrorString);

    getCaseByDocketNumber.mockResolvedValueOnce({
      ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      docketEntries: leadCaseDocketEntries,
    });

    getCasesByDocketNumbers.mockResolvedValueOnce([
      // @ts-ignore // This is a bad mock. MOCK_LEAD_CASE_WITH_PAPER_SERVICE should be properly typed.
      {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        docketEntries: leadCaseDocketEntries,
      },
    ]);

    updateDocketEntryPendingServiceStatus
      .mockImplementationOnce(async () => {})
      .mockRejectedValueOnce(innerError);

    await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        clientConnectionId,
        docketEntryId: leadCaseDocketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        form: leadCaseDocketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      `Encountered an exception trying to reset isPendingService on Docket Number ${MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber}.`,
      innerError,
    );
  });

  it('should create a single source of truth for the document by saving only one copy', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        clientConnectionId,
        docketEntryId: leadCaseDocketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        form: leadCaseDocketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalledTimes(2);
  });
});
