const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  completeDocketEntryQCInteractor,
  getNeedsNewCoversheet,
} = require('./completeDocketEntryQCInteractor');

describe('completeDocketEntryQCInteractor', () => {
  let caseRecord;

  const mockUser = {
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    const PDF_MOCK_BUFFER = 'Hello World';

    const workItem = {
      docketEntry: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      docketNumber: '45678-18',
      section: DOCKET_SECTION,
      sentBy: 'Test User',
      sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      updatedAt: applicationContext.getUtilities().createISODateString(),
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

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
          addToCoversheet: false,
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info 2',
          certificateOfService: true,
          certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
          docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Petr. Guy Fieri',
          index: 42,
          isOnDocketRecord: true,
          receivedAt: '2019-08-25T05:00:00.000Z',
          servedAt: '2019-08-25T05:00:00.000Z',
          servedParties: [{ name: 'Bernard Lowe' }],
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItem,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          receivedAt: '2019-08-27T05:00:00.000Z',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItem,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          receivedAt: '2019-08-29T05:00:00.000Z',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItem,
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext.getPug.mockImplementation(() => ({
      compile: () => () => '',
    }));

    applicationContext.getCurrentUser.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(caseRecord);

    applicationContext.getUniqueId.mockReturnValue(
      'b6f835aa-bf95-4996-b858-c8e94566db47',
    );

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

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: 'www.example.com',
      });
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      completeDocketEntryQCInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('adds documents and workitems', async () => {
    await expect(
      completeDocketEntryQCInteractor(applicationContext, {
        entryMetadata: {
          docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Document Title',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          partyPrimary: true,
        },
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('serves the document for electronic-only parties if a notice of docket change is generated', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Test Petitioner',
      phone: '1234567890',
      postalCode: '12345',
      state: 'AK',
    };

    const result = await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
    expect(result.paperServiceParties.length).toEqual(0);
  });

  it('should generate a notice of docket change with a new coversheet when additional info fields are added and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        addToCoversheet: true,
        additionalInfo: '123',
        additionalInfo2: 'abc',
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: caseRecord.docketEntries[0].documentTitle,
        documentType: caseRecord.docketEntries[0].documentType,
        eventCode: caseRecord.docketEntries[0].eventCode,
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer 123 abc',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change without a new coversheet when the certificate of service date has been updated', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        ...caseRecord.docketEntries[0],
        certificateOfService: true,
        certificateOfServiceDate: '2019-08-06T07:53:09.001Z',
        filedBy: 'Petr. Guy Fieri',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer additional info (C/S 08/06/19) additional info 2',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change without a new coversheet when attachments has been updated', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        ...caseRecord.docketEntries[0],
        attachments: true,
        filedBy: 'Petr. Guy Fieri',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after:
        'Answer additional info (C/S 08/25/19) (Attachment(s)) additional info 2',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change with a new coversheet when additional info fields are removed and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        addToCoversheet: true,
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: caseRecord.docketEntries[0].documentTitle,
        documentType: caseRecord.docketEntries[0].documentType,
        eventCode: caseRecord.docketEntries[0].eventCode,
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change with a new coversheet when documentTitle has changed and addToCoversheeet is false', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        addToCoversheet: false,
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Something Different',
        documentType: caseRecord.docketEntries[0].documentType,
        eventCode: caseRecord.docketEntries[0].eventCode,
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Something Different',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should not generate a new coversheet when the documentTitle has not changed and addToCoversheet is false', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        ...caseRecord.docketEntries[0],
        addToCoversheet: false,
        additionalInfo: 'additional info',
        additionalInfo2: 'additional info 2',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange,
    ).not.toBeCalled();
  });

  it('should generate a new coversheet when additionalInfo is changed and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        addToCoversheet: true,
        additionalInfo: 'additional info',
        additionalInfo2: 'additional info 221',
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: caseRecord.docketEntries[0].documentTitle,
        documentType: caseRecord.docketEntries[0].documentType,
        eventCode: caseRecord.docketEntries[0].eventCode,
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer additional info additional info 221',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a new coversheet when additionalInfo is NOT changed and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        addToCoversheet: true,
        additionalInfo: 'additional info',
        additionalInfo2: 'additional info',
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: caseRecord.docketEntries[0].documentTitle,
        documentType: caseRecord.docketEntries[0].documentType,
        eventCode: caseRecord.docketEntries[0].eventCode,
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer additional info additional info',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('serves the document for parties with paper service if a notice of docket change is generated', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Test Petitioner',
      postalCode: '12345',
      state: 'AK',
    };
    caseRecord.isPaper = true;
    caseRecord.mailingDate = '2019-03-01T21:40:46.415Z';

    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockImplementation(() => {
        return mockNumberOfPages;
      });

    const result = await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        partyPrimary: true,
      },
    });

    const noticeOfDocketChange = result.caseDetail.docketEntries.find(
      docketEntry => docketEntry.eventCode === 'NODC',
    );

    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();

    expect(noticeOfDocketChange).toMatchObject({
      isFileAttached: true,
      numberOfPages: 999,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
    expect(result.paperServiceParties.length).toEqual(1);
  });

  it('generates a document for paper service if the document is a Notice of Change of Address and the case has paper service parties', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Test Petitioner',
      postalCode: '12345',
      state: 'AK',
    };
    caseRecord.isPaper = true;
    caseRecord.mailingDate = '2019-03-01T21:40:46.415Z';

    const result = await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Notice of Change of Address',
        documentType: 'Notice of Change of Address',
        eventCode: 'MISP',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
    expect(result.paperServiceParties.length).toEqual(1);
  });

  it('does not generate a document for paper service if the document is a Notice of Change of Address and the case has no paper service parties', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Test Petitioner',
      phone: '123 456 1234',
      postalCode: '12345',
      state: 'AK',
    };

    const result = await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Notice of Change of Address',
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual(undefined);
    expect(result.paperServiceParties.length).toEqual(0);
  });

  it('should update only allowed editable fields on a docket entry document', async () => {
    await completeDocketEntryQCInteractor(applicationContext, {
      entryMetadata: {
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Edited Document',
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        freeText: 'Some text about this document',
        hasOtherFilingParty: true,
        isPaper: true,
        otherFilingParty: 'Bert Brooks',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[0],
    ).toMatchObject({
      documentTitle: 'My Edited Document',
      documentType: 'Notice of Change of Address',
      eventCode: 'NCA',
      freeText: 'Some text about this document',
      hasOtherFilingParty: true,
      otherFilingParty: 'Bert Brooks',
    });
  });

  it('updates automaticBlocked on a case and all associated case trial sort mappings', async () => {
    expect(caseRecord.automaticBlocked).toBeFalsy();

    const { caseDetail } = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Edited Document',
          documentType: 'Notice of Change of Address',
          eventCode: 'NCA',
          freeText: 'Some text about this document',
          hasOtherFilingParty: true,
          isPaper: true,
          otherFilingParty: 'Bert Brooks',
          partyPrimary: true,
          pending: true,
        },
      },
    );

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(caseDetail.automaticBlocked).toBeTruthy();
  });

  it('normalizes receivedAt dates to ISO string format', async () => {
    caseRecord.docketEntries = [
      {
        addToCoversheet: false,
        additionalInfo: 'additional info',
        additionalInfo2: 'additional info 2',
        certificateOfService: true,
        certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Petr. Guy Fieri',
        index: 42,
        isOnDocketRecord: true,
        receivedAt: '2021-01-01', // date only
        servedAt: '2019-08-25T05:00:00.000Z',
        servedParties: [{ name: 'Bernard Lowe' }],
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ];

    const { caseDetail } = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Edited Document',
          documentType: 'Notice of Change of Address',
          eventCode: 'NCA',
          freeText: 'Some text about this document',
          hasOtherFilingParty: true,
          isPaper: true,
          otherFilingParty: 'Bert Brooks',
          partyPrimary: true,
          pending: true,
          receivedAt: '2021-01-01', // date only
        },
      },
    );

    expect(caseDetail.docketEntries[0].receivedAt).toEqual(
      '2021-01-01T05:00:00.000Z',
    );
  });

  describe('getNeedsNewCoversheet', () => {
    it('should return true when receivedAt is updated', () => {
      const needsNewCoversheet = getNeedsNewCoversheet({
        currentDocketEntry: {
          receivedAt: '2019-08-25T05:00:00.000Z',
        },
        updatedDocketEntry: {
          receivedAt: '2020-08-26T05:00:00.000Z',
        },
      });

      expect(needsNewCoversheet).toBeTruthy();
    });

    it('should return false when receivedAt format is different but the date is the same', () => {
      const needsNewCoversheet = getNeedsNewCoversheet({
        currentDocketEntry: {
          receivedAt: '2019-08-25',
        },
        updatedDocketEntry: {
          receivedAt: '2019-08-25T05:00:00.000Z',
        },
      });

      expect(needsNewCoversheet).toBeFalsy();
    });

    it('should return true when certificateOfService is updated', () => {
      const needsNewCoversheet = getNeedsNewCoversheet({
        currentDocketEntry: {
          certificateOfService: false,
          receivedAt: '2019-08-12T05:00:00.000Z',
        },
        updatedDocketEntry: {
          certificateOfService: true,
          receivedAt: '2019-08-12T05:00:00.000Z',
        },
      });

      expect(needsNewCoversheet).toBeTruthy();
    });

    it('should return false when filedBy is updated', () => {
      const needsNewCoversheet = getNeedsNewCoversheet({
        currentDocketEntry: {
          filedBy: 'petitioner.smith',
          receivedAt: '2019-08-12T05:00:00.000Z',
        },
        updatedDocketEntry: {
          filedBy: 'petitioner.high',
          receivedAt: '2019-08-12T05:00:00.000Z',
        },
      });

      expect(needsNewCoversheet).toBeFalsy();
    });

    it('should return true when documentTitle is updated', () => {
      const needsNewCoversheet = getNeedsNewCoversheet({
        currentDocketEntry: {
          documentTitle: 'fake title',
          receivedAt: '2019-08-12T05:00:00.000Z',
        },
        updatedDocketEntry: {
          documentTitle: 'fake title 2!!!',
          receivedAt: '2019-08-12T05:00:00.000Z',
        },
      });

      expect(needsNewCoversheet).toBeTruthy();
    });
  });
});
