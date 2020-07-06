const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  completeDocketEntryQCInteractor,
} = require('./completeDocketEntryQCInteractor');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

describe('completeDocketEntryQCInteractor', () => {
  let caseRecord;

  beforeEach(() => {
    const testPdfDocBytes = () => {
      // sample.pdf is a 1 page document
      return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
    };
    const testPdfDoc = testPdfDocBytes();

    const PDF_MOCK_BUFFER = 'Hello World';

    const workItem = {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '45678-18',
      document: {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        filedBy: 'Test Petitoner',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      isQC: true,
      section: 'docket',
      sentBy: 'Test User',
      sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      updatedAt: new Date().toISOString(),
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    caseRecord = {
      caseCaption: 'Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
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
      docketNumber: '45678-18',
      docketRecord: [
        {
          description: 'Answer Docket Record Entry',
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          eventCode: 'A',
          index: 42,
        },
      ],
      documents: [
        {
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info 2',
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitoner',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItems: [workItem],
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
          documentType: 'Answer',
          filedBy: 'Test Petitoner',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItems: [workItem],
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          filedBy: 'Test Petitoner',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItems: [workItem],
        },
      ],
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
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);
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
          caseId: caseRecord.caseId,
          description: 'Memorandum in Support',
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Document Title',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
        },
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
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
        caseId: caseRecord.caseId,
        description: 'Memorandum in Support',
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
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
        caseId: caseRecord.caseId,
        description: 'Memorandum in Support',
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
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
        caseId: caseRecord.caseId,
        description: 'Memorandum in Support',
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
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
        caseId: caseRecord.caseId,
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
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

    const result = await completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata: {
        caseId: caseRecord.caseId,
        description: 'Memorandum in Support',
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
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
        caseId: caseRecord.caseId,
        description: 'Memorandum in Support',
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Notice of Change of Address',
        documentType: 'Notice of Change of Address',
        eventCode: 'MISP',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
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
      postalCode: '12345',
      state: 'AK',
    };

    const result = await completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata: {
        caseId: caseRecord.caseId,
        description: 'Memorandum in Support',
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Notice of Change of Address',
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
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
});
