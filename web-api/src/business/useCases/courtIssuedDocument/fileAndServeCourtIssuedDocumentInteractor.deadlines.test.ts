import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase',
);
jest.mock(
  '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus',
);
jest.mock('@web-api/persistence/postgres/cases/getConsolidatedCases');
jest.mock('@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines');
jest.mock('@web-api/persistence/postgres/users/getUserById');
import {
  CaseStatus,
  CaseType,
  DOCKET_SECTION,
  TRANSCRIPT_EVENT_CODE,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '@shared/test/mockUsers';
import { fileAndServeCourtIssuedDocumentInteractor } from './fileAndServeCourtIssuedDocumentInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { testPdfDoc } from '@shared/business/test/getFakeFile';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fileAndServeDocumentOnOneCase as fileAndServeDocumentOnOneCaseMock } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { CourtIssuedDocumentAnyType } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

let MOCK_DATE;

jest.mock('@shared/business/utilities/DateHandler', () => {
  const originalModule = jest.requireActual(
    '@shared/business/utilities/DateHandler',
  );
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn().mockImplementation(() => MOCK_DATE),
  };
});

describe('fileAndServeCourtIssuedDocumentInteractor.deadlines', () => {
  const getUserById = jest.mocked(getUserByIdMock);
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const fileAndServeDocumentOnOneCase = jest.mocked(
    fileAndServeDocumentOnOneCaseMock,
  );
  let caseRecord: RawCase;
  let mockWorkItem;
  let mockDocketEntryWithWorkItem;
  let mockDeadline;
  let consolidatedCaseExample;

  const mockPdfUrl = 'www.example.com';
  const mockClientConnectionId = 'ABC123';
  const mockDocketEntryId = 'mockdocketentryid';

  beforeEach(() => {
    MOCK_DATE = '2022-12-06T22:54:06.000Z';

    mockWorkItem = {
      docketNumber: MOCK_CASE.docketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };

    mockDocketEntryWithWorkItem = {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      documentTitle: 'Order',
      documentType: 'Order',
      eventCode: 'O',
      signedAt: '2019-03-01T21:40:46.415Z',
      signedByUserId: docketClerkUser.userId,
      signedJudgeName: 'Dredd',
      userId: docketClerkUser.userId,
      workItem: mockWorkItem,
    };

    caseRecord = {
      ...MOCK_CASE,
      associatedJudge: judgeUser.name,
      docketEntries: [
        mockDocketEntryWithWorkItem,
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: MOCK_CASE.docketNumber,
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
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          userId: docketClerkUser.userId,
        },
      ],
    };

    mockDeadline = {
      caseDeadlineId: 'test-deadline-id',
      deadlineDate: '2030-01-20T00:00:00.000Z',
      description: 'Test Deadline',
    };

    consolidatedCaseExample = {
      petitioners: [] as TPetitioner[],
      caseCaption: '',
      caseType: 'Deficiency' as CaseType,
      createdAt: '',
      partyType: '',
      petitionPaymentStatus: '',
      procedureType: '',
      receivedAt: '',
      status: '' as CaseStatus,
      sortableDocketNumber: 0,
      docketEntries: [],
      hearings: [],
      correspondence: [],
      consolidatedCases: [],
      docketNumberWithSuffix: '',
    };

    getUserById.mockResolvedValue(docketClerkUser as DbUser);

    getCaseByDocketNumber.mockResolvedValue(caseRecord);
    getCasesByDocketNumbers.mockResolvedValue([caseRecord]);

    fileAndServeDocumentOnOneCase.mockImplementation(
      ({ caseEntity }) => caseEntity,
    );

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockResolvedValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getUseCaseHelpers()
      .stampDocumentForService.mockResolvedValue(testPdfDoc);

    applicationContext
      .getUseCaseHelpers()
      .autoGenerateDeadline.mockResolvedValue([mockDeadline]);
  });
  it('should create a deadline if the Status report order has a due date and order type', async () => {
    const mockAutoGeneratedDeadlineForm: CourtIssuedDocumentAnyType = {
      documentType: 'Order',
      eventCode: 'O',
      date: '2030-01-20T00:00:00.000Z',
      orderType: 'statusReport',
      docketEntryId: mockDocketEntryId,
      attachments: true,
      documentTitle: '',
    };
    await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        form: mockAutoGeneratedDeadlineForm,
        subjectCaseDocketNumber: caseRecord.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().autoGenerateDeadline.mock
        .calls[0][0],
    ).toMatchObject({
      deadlineDate: mockAutoGeneratedDeadlineForm.date,
      description: 'Status Report Due',
    });
  });

  it('should create deadlines for each consolidated case of a lead docket case', async () => {
    const caseRecord: RawCase = {
      ...MOCK_CASE,
      docketNumber: '999-99',
      leadDocketNumber: '999-99',
      associatedJudge: judgeUser.name,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
        },
      ],
    };
    getCaseByDocketNumber.mockResolvedValue(caseRecord);
    getCasesByDocketNumbers.mockResolvedValue([caseRecord]);

    const mockAutoGeneratedDeadlineForm: CourtIssuedDocumentAnyType = {
      documentType: 'Order',
      eventCode: 'O',
      date: '2030-01-20T00:00:00.000Z',
      orderType: 'statusReport',
      docketEntryId: mockDocketEntryId,
      attachments: true,
      documentTitle: '',
    };

    const mockGetConsolidatedCases = jest.mocked(getConsolidatedCases);

    mockGetConsolidatedCases.mockResolvedValue([
      {
        ...consolidatedCaseExample,
        docketNumber: MOCK_CASE.docketNumber,
        leadDocketNumber: '999-99',
      },
      {
        ...consolidatedCaseExample,
        docketNumber: '456-20',
        leadDocketNumber: '999-99',
      },
      {
        ...consolidatedCaseExample,
        docketNumber: '999-99',
        leadDocketNumber: '999-99',
      },
    ]);

    const mockUpsertCaseDeadlines = jest.mocked(upsertCaseDeadlines);

    await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumbers: [],
        form: mockAutoGeneratedDeadlineForm,
        subjectCaseDocketNumber: caseRecord.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(mockGetConsolidatedCases).toHaveBeenCalledWith({
      leadDocketNumber: '999-99',
    });
    expect(mockUpsertCaseDeadlines).toHaveBeenCalled();
  });
});
