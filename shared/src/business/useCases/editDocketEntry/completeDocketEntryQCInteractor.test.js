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
} = require('./completeDocketEntryQCInteractor');

describe('completeDocketEntryQCInteractor', () => {
  let caseRecord;

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
      updatedAt: new Date().toISOString(),
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
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info 2',
          docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          index: 42,
          isOnDocketRecord: true,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItem,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItem,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
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
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      completeDocketEntryQCInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('adds documents and workitems', async () => {
    await expect(
      completeDocketEntryQCInteractor({
        applicationContext,
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
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
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

    const result = await completeDocketEntryQCInteractor({
      applicationContext,
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
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
    expect(result.paperServiceParties.length).toEqual(0);
  });

  it('generates a notice of docket change with a new coversheet if additional info fields are added and serves the document', async () => {
    await completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata: {
        additionalInfo: '123',
        additionalInfo2: 'abc',
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
  });

  it('generates a notice of docket change with a new coversheet if additional info fields are removed and serves the document', async () => {
    await completeDocketEntryQCInteractor({
      applicationContext,
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
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toBeCalled();
  });

  it('does not generate a new coversheet if nothing changes', async () => {
    await completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata: {
        additionalInfo: 'additional info',
        additionalInfo2: 'additional info 2',
        docketEntryId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        partyPrimary: true,
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toBeCalled();
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

    const result = await completeDocketEntryQCInteractor({
      applicationContext,
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
      document => document.eventCode === 'NODC',
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
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
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

    const result = await completeDocketEntryQCInteractor({
      applicationContext,
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
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
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

    const result = await completeDocketEntryQCInteractor({
      applicationContext,
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
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual(undefined);
    expect(result.paperServiceParties.length).toEqual(0);
  });

  it('should update only allowed editable fields on a docket entry document', async () => {
    await completeDocketEntryQCInteractor({
      applicationContext,
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
});
