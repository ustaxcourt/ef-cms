const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  serveExternallyFiledDocumentInteractor,
} = require('./serveExternallyFiledDocumentInteractor');
jest.mock('../addCoversheetInteractor');
const { addCoverToPdf } = require('../addCoversheetInteractor');

describe('serveExternallyFiledDocumentInteractor', () => {
  let caseRecord;
  const DOCKET_NUMBER = '101-20';
  const DOCKET_ENTRY_ID = '225d5474-b02b-4137-a78e-2043f7a0f806';

  beforeAll(() => {
    const PDF_MOCK_BUFFER = 'Hello World';

    addCoverToPdf.mockResolvedValue({
      pdfData: testPdfDoc,
    });

    applicationContext.getPug.mockImplementation(() => ({
      compile: () => () => '',
    }));
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
    applicationContext
      .getStorageClient()
      .upload.mockImplementation((params, resolve) => resolve());
    applicationContext.getChromiumBrowser().newPage.mockReturnValue({
      addStyleTag: () => {},
      pdf: () => {
        return PDF_MOCK_BUFFER;
      },
      setContent: () => {},
    });
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'www.example.com',
      });
  });

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f806',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
      docketNumber: DOCKET_NUMBER,
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      serveExternallyFiledDocumentInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should update the document with a servedAt date', async () => {
    await serveExternallyFiledDocumentInteractor({
      applicationContext,
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    const updatedCaseDocument = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.docketEntryId === DOCKET_ENTRY_ID,
      );
    expect(updatedCaseDocument).toMatchObject({
      servedAt: expect.anything(),
      servedParties: expect.anything(),
    });
  });

  it('should add a coversheet to the document', async () => {
    await serveExternallyFiledDocumentInteractor({
      applicationContext,
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
    });

    expect(addCoverToPdf).toHaveBeenCalledTimes(1);
  });

  it('should send electronic-service parties emails', async () => {
    await serveExternallyFiledDocumentInteractor({
      applicationContext,
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0],
    ).toMatchObject({
      servedParties: {
        all: [
          {
            email: 'fieri@example.com',
            name: 'Guy Fieri',
          },
        ],
        electronic: [
          {
            email: 'fieri@example.com',
            name: 'Guy Fieri',
          },
        ],
        paper: [],
      },
    });
  });

  it('should generate and return a paper-service PDF if there are paper service parties on the case', async () => {
    caseRecord.contactPrimary.serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_PAPER;

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

    const result = await serveExternallyFiledDocumentInteractor({
      applicationContext,
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
  });

  it('if the workItem exists, it should complete the work item by deleting it from the QC inbox and adding it to the outbox (served)', async () => {
    caseRecord.docketEntries = [
      ...caseRecord.docketEntries,
      {
        docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
        documentType: 'Administrative Record',
        eventCode: 'ADMR',
        filedBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItem: {
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
            documentType: 'Administrative Record',
            entityName: 'DocketEntry',
            eventCode: 'ADMR',
            filedBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
            filingDate: '2019-03-11T21:56:01.625Z',
            isDraft: false,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            sentBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          docketNumber: DOCKET_NUMBER,
          isInitializeCase: true,
          section: DOCKET_SECTION,
          sentBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        },
      },
    ];

    await serveExternallyFiledDocumentInteractor({
      applicationContext,
      docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
      docketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        workItem: expect.objectContaining({
          docketNumber: DOCKET_NUMBER,
          sentBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        }),
      }),
    );
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        workItem: expect.objectContaining({
          assigneeId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          completedAt: expect.stringContaining('T'),
          completedByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          completedMessage: 'completed',
          docketNumber: DOCKET_NUMBER,
          sentBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        }),
      }),
    );
  });

  it('should update the case with the completed work item when the work item exists', async () => {
    const mockDocketEntryWithWorkItemId =
      '225d5474-b02b-4137-a78e-2043f7a0f805';
    caseRecord.docketEntries = [
      ...caseRecord.docketEntries,
      {
        docketEntryId: mockDocketEntryWithWorkItemId,
        documentType: 'Administrative Record',
        eventCode: 'ADMR',
        filedBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItem: {
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
            documentType: 'Administrative Record',
            entityName: 'DocketEntry',
            eventCode: 'ADMR',
            filedBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
            filingDate: '2019-03-11T21:56:01.625Z',
            isDraft: false,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            sentBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
          docketNumber: DOCKET_NUMBER,
          isInitializeCase: true,
          section: DOCKET_SECTION,
          sentBy: 'Emmett Lathrop "Doc" Brown, Ph.D.',
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        },
      },
    ];

    await serveExternallyFiledDocumentInteractor({
      applicationContext,
      docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
      docketNumber: DOCKET_NUMBER,
    });

    const updatedWorkItem = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.docketEntryId === mockDocketEntryWithWorkItemId,
      ).workItem;
    expect(updatedWorkItem.completedAt).toBeDefined();
  });
});
