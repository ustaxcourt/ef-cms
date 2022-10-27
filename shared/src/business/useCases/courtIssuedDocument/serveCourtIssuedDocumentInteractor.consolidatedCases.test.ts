import { Case } from '../../entities/cases/Case';
import {
  DOCKET_SECTION,
  TRANSCRIPT_EVENT_CODE,
} from '../../entities/EntityConstants';
import {
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocuments';
import {
  applicationContext,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';
import { serveCourtIssuedDocumentInteractor } from './serveCourtIssuedDocumentInteractor';
import { v4 as uuidv4 } from 'uuid';

describe('serveCourtIssuedDocumentInteractor consolidated cases', () => {
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

  let addDocketEntrySpy;
  let leadCaseDocketEntries;
  let consolidatedCase1DocketEntries;

  beforeAll(() => {
    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue(null);
  });

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

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

    addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
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
  });

  it('should call serveDocumentAndGetPaperServicePdf and pass the resulting url and success message to `sendNotificationToUser` along with the `clientConnectionId`', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: leadCaseDocketEntries[0].docketEntryId,
      docketNumbers: [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toEqual({
      applicationContext: expect.anything(),
      clientConnectionId,
      message: expect.objectContaining({
        action: 'serve_document_complete',
        alertSuccess: {
          message: 'Document served to selected cases in group. ',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });

    expect(addDocketEntrySpy).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalledTimes(3);

    const consolidatedCase1DocketEntry = addDocketEntrySpy.mock.calls[0][0];
    const consolidatedCase2DocketEntry = addDocketEntrySpy.mock.calls[1][0];

    expect(consolidatedCase1DocketEntry).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        workItem: expect.objectContaining({
          caseStatus: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.status,
          caseTitle: Case.getCaseTitle(
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.caseCaption,
          ),
          docketNumber:
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        }),
      }),
    );

    expect(consolidatedCase2DocketEntry).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        workItem: expect.objectContaining({
          caseStatus: MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.status,
          caseTitle: Case.getCaseTitle(
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.caseCaption,
          ),
          docketNumber:
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        }),
      }),
    );

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(3);

    const initialCall = 1;
    const finallyBlockCalls = 3;

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledTimes(finallyBlockCalls + initialCall);
  });

  it('should call updateDocketEntryPendingServiceStatus on error', async () => {
    const expectedErrorString = 'expected error';

    applicationContext
      .getPersistenceGateway()
      .saveWorkItem.mockImplementationOnce(() => {})
      .mockImplementationOnce(() => {})
      .mockRejectedValueOnce(new Error(expectedErrorString));

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: leadCaseDocketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      }),
    ).rejects.toThrow(expectedErrorString);

    const initialCall = 1;
    const finallyBlockCalls = 3;

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledTimes(finallyBlockCalls + initialCall);
  });

  it('should log the failure to call updateDocketEntryPendingServiceStatus in the finally block', async () => {
    const expectedErrorString = 'expected error';

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: leadCaseDocketEntries,
        };
      })
      .mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: leadCaseDocketEntries,
        };
      })
      .mockRejectedValueOnce(new Error(expectedErrorString));

    const innerError = new Error('something else');

    applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus.mockImplementationOnce(() => {})
      .mockRejectedValueOnce(innerError);

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: leadCaseDocketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      }),
    ).rejects.toThrow(expectedErrorString);

    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    expect(applicationContext.logger.error.mock.calls[0][1]).toEqual(
      innerError,
    );
  });

  it('should create a work item and add it to the outbox for each case', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: leadCaseDocketEntries[0].docketEntryId,
      docketNumbers: [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem.docketNumber,
    ).toEqual(MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[1][0]
        .workItem.docketNumber,
    ).toEqual(MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[2][0]
        .workItem.docketNumber,
    ).toEqual(MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber);

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].workItem,
    ).toEqual(
      expect.objectContaining({
        docketNumber: mockWorkItem.docketNumber,
        leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.leadDocketNumber,
      }),
    );
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[1][0].workItem,
    ).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.leadDocketNumber,
      }),
    );
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[2][0].workItem,
    ).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.leadDocketNumber,
      }),
    );
  });

  it('should create a single source of truth for the document by saving only one copy', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: leadCaseDocketEntries[0].docketEntryId,
      docketNumbers: [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalledTimes(1);
  });
});
