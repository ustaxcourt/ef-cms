const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  updateDocketEntryInteractor,
} = require('./updateDocketEntryInteractor');

describe('updateDocketEntryInteractor', () => {
  let mockCurrentUser;

  const workItem = {
    docketNumber: '45678-18',
    document: {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      eventCode: 'A',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    section: DOCKET_SECTION,
    sentBy: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    updatedAt: new Date().toISOString(),
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  const docketEntries = [
    {
      docketNumber: '45678-18',
      documentId: 'e24ba5a9-b37b-479d-9201-067ec6e335e2',
      documentType: 'Petition',
      eventCode: 'P',
      filedBy: 'Test Petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItems: [workItem],
    },
    {
      docketNumber: '45678-18',
      documentId: 'b44ba5a9-b37b-479d-9201-067ec6e335b4',
      documentType: 'Record on Appeal',
      eventCode: 'ROA',
      filedBy: 'Test Petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItems: [workItem],
    },
    {
      docketNumber: '45678-18',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      eventCode: 'A',
      filedBy: 'Test Petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItem,
    },
    {
      docketNumber: '45678-18',
      documentId: 'd34ba5a9-b37b-479d-9201-067ec6e335d3',
      documentType: 'Record on Appeal',
      eventCode: 'ROA',
      filedBy: 'Test Petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItems: [workItem],
    },
    {
      docketNumber: '45678-18',
      documentId: 'f14ba5a9-b37b-479d-9201-067ec6e335f1',
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      filedBy: 'Test Petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItems: [workItem],
    },
  ];

  const caseRecord = {
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
    docketEntries,
    docketNumber: '45678-18',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    role: ROLES.petitioner,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    mockCurrentUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
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
    mockCurrentUser = {};

    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates the workitem without updating the document if no file is attached', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: false,
          partyPrimary: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('adds documents and workitems', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: true,
          partyPrimary: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('adds documents and workitems but does not try to delete workitem because they all have files attached', async () => {
    workItem.document.isFileAttached = true;
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: true,
          partyPrimary: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('add documents but not workitems for paper filed documents', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isPaper: true,
          partyPrimary: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('should update only allowed editable fields on a docket entry document', async () => {
    await updateDocketEntryInteractor({
      applicationContext,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Edited Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        freeText: 'Some text about this document',
        hasOtherFilingParty: true,
        isPaper: true,
        otherFilingParty: 'Bert Brooks',
        partyPrimary: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[2],
    ).toMatchObject({
      documentTitle: 'My Edited Document',
      freeText: 'Some text about this document',
      hasOtherFilingParty: true,
      otherFilingParty: 'Bert Brooks',
    });
  });

  it('updates document and workitem metadata with a file attached, but saving for later', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: true,
          partyPrimary: true,
        },
        isSavingForLater: true,
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketEntryInProgress,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toBeCalled();
  });

  it('updates document and workitem metadata with no file attached', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: false,
          partyPrimary: true,
        },
        isSavingForLater: true,
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketEntryInProgress,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
