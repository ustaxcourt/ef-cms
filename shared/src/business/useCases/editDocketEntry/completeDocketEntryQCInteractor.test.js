const {
  completeDocketEntryQCInteractor,
} = require('./completeDocketEntryQCInteractor');
const { User } = require('../../entities/User');
import {
  createISODateString,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
const fs = require('fs');
const path = require('path');
const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

describe('completeDocketEntryQCInteractor', () => {
  const testPdfDocBytes = () => {
    // sample.pdf is a 1 page document
    return fs.readFileSync(testAssetsPath + 'sample.pdf');
  };

  let applicationContext;
  let globalUser;
  const getCaseByCaseIdSpy = jest.fn(() => caseRecord);
  const deleteWorkItemFromInboxSpy = jest.fn();
  const saveWorkItemForDocketClerkFilingExternalDocumentSpy = jest.fn();
  const updateCaseSpy = jest.fn();
  let serveDocumentOnPartiesSpy = jest.fn();
  const testPdfDoc = testPdfDocBytes();
  const addCoversheetInteractorSpy = jest.fn();

  const PDF_MOCK_BUFFER = 'Hello World';
  const pageMock = {
    addStyleTag: () => {},
    pdf: () => {
      return PDF_MOCK_BUFFER;
    },
    setContent: () => {},
  };
  const chromiumBrowserMock = {
    close: jest.fn(),
    newPage: () => pageMock,
  };

  const workItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    document: {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    isQC: true,
    section: 'docket',
    sentBy: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    updatedAt: new Date().toISOString(),
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  let caseRecord;

  beforeEach(() => {
    caseRecord = {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      createdAt: '',
      docketNumber: '45678-18',
      docketRecord: [
        { documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb', index: 42 },
      ],
      documents: [
        {
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info 2',
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItems: [workItem],
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
          documentType: 'Answer',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItems: [workItem],
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          workItems: [workItem],
        },
      ],
      role: User.ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    jest.clearAllMocks();

    globalUser = new User({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext = {
      environment: { stage: 'local' },
      getChromiumBrowser: () => chromiumBrowserMock,
      getCurrentUser: () => globalUser,
      getDocumentsBucketName: () => 'DocumentBucketName',
      getNodeSass: () => ({ render: (data, cb) => cb(data, { css: '' }) }),
      getPersistenceGateway: () => ({
        deleteWorkItemFromInbox: deleteWorkItemFromInboxSpy,
        getCaseByCaseId: getCaseByCaseIdSpy,
        getDownloadPolicyUrl: () => ({
          url: 'www.example.com',
        }),
        getUserById: async () => globalUser,
        saveDocument: jest.fn(),
        saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
        updateCase: updateCaseSpy,
      }),
      getPug: () => ({ compile: () => () => '' }),
      getStorageClient: () => ({
        getObject: jest.fn().mockReturnValue({
          promise: async () => ({
            Body: testPdfDoc,
          }),
        }),
        upload: jest.fn().mockImplementation((params, resolve) => resolve()),
      }),
      getUniqueId: () => 'b6f835aa-bf95-4996-b858-c8e94566db47',
      getUseCaseHelpers: () => ({
        generatePaperServiceAddressPagePdf: jest
          .fn()
          .mockResolvedValue(testPdfDoc),
        serveDocumentOnParties: serveDocumentOnPartiesSpy,
      }),
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetInteractorSpy,
      }),
      getUtilities: () => {
        return {
          createISODateString,
          formatDateString,
        };
      },
      logger: {
        error: () => {},
        time: () => {},
        timeEnd: () => {},
      },
    };
  });

  it('should throw an error if not authorized', async () => {
    let error;
    globalUser = {
      name: 'Olivia Jade',
      role: User.ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    try {
      await completeDocketEntryQCInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('adds documents and workitems', async () => {
    let error;

    try {
      await completeDocketEntryQCInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
  });

  it('serves the document for electronic-only parties if a notice of docket change is generated', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Petitioner',
      postalCode: '12345',
      state: 'AK',
    };

    let error;
    let result;

    try {
      result = await completeDocketEntryQCInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Something Else',
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(serveDocumentOnPartiesSpy).toBeCalled();
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
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
      },
    });
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(serveDocumentOnPartiesSpy).toBeCalled();
    expect(addCoversheetInteractorSpy).toBeCalled();
  });

  it('generates a notice of docket change with a new coversheet if additional info fields are removed and serves the document', async () => {
    await completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata: {
        caseId: caseRecord.caseId,
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Something Else',
        documentType: 'Memorandum in Support',
      },
    });
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(serveDocumentOnPartiesSpy).toBeCalled();
    expect(addCoversheetInteractorSpy).toBeCalled();
  });

  it('does not generate a new coversheet if nothing changes', async () => {
    await completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata: {
        additionalInfo: 'additional info',
        additionalInfo2: 'additional info 2',
        caseId: caseRecord.caseId,
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
      },
    });
    expect(addCoversheetInteractorSpy).not.toBeCalled();
  });

  it('serves the document for parties with paper service if a notice of docket change is generated', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: 'domestic',
      name: 'Test Petitioner',
      postalCode: '12345',
      state: 'AK',
    };
    caseRecord.isPaper = true;
    caseRecord.mailingDate = '2019-03-01T21:40:46.415Z';

    serveDocumentOnPartiesSpy = jest.fn().mockResolvedValue('www.example.com');

    let error;
    let result;

    try {
      result = await completeDocketEntryQCInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Something Else',
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(serveDocumentOnPartiesSpy).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
    expect(result.paperServiceParties.length).toEqual(1);
  });

  it('generates a document for paper service if the document is a Notice of Change of Address and the case has paper service parties', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: 'domestic',
      name: 'Test Petitioner',
      postalCode: '12345',
      state: 'AK',
    };
    caseRecord.isPaper = true;
    caseRecord.mailingDate = '2019-03-01T21:40:46.415Z';

    let error;
    let result;

    try {
      result = await completeDocketEntryQCInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Notice of Change of Address',
          documentType: 'Notice of Change of Address',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
    expect(result.paperServiceParties.length).toEqual(1);
  });

  it('does not generate a document for paper service if the document is a Notice of Change of Address and the case has no paper service parties', async () => {
    caseRecord.contactPrimary = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Petitioner',
      postalCode: '12345',
      state: 'AK',
    };

    let error;
    let result;

    try {
      result = await completeDocketEntryQCInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Notice of Change of Address',
          documentType: 'Notice of Change of Address',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(result.paperServicePdfUrl).toEqual(undefined);
    expect(result.paperServiceParties.length).toEqual(0);
  });
});
