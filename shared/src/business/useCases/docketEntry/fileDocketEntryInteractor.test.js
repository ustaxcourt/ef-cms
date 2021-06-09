const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const { fileDocketEntryInteractor } = require('./fileDocketEntryInteractor');

describe('fileDocketEntryInteractor', () => {
  const user = {
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };
  let caseRecord;

  beforeAll(() => {
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
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(user);
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileDocketEntryInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('add documents but not workitems for paper filed documents', async () => {
    await fileDocketEntryInteractor(applicationContext, {
      documentMetadata: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0].docketEntryId,
    ).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('add documents and workItem to inbox if saving for later if a document is attached', async () => {
    await fileDocketEntryInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      isSavingForLater: true,
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toBeCalled();
  });

  it('add documents and workItem to inbox when NOT saving for later if a document is attached', async () => {
    await fileDocketEntryInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      isSavingForLater: false,
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toBeCalled();
  });

  it('sets the case as blocked if the document filed is a tracked document type', async () => {
    await fileDocketEntryInteractor(applicationContext, {
      documentMetadata: {
        category: 'Application',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Application for Examination Pursuant to Rule 73',
        documentType: 'Application for Examination Pursuant to Rule 73',
        eventCode: 'AFE',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });

  it('sets the case as blocked with due dates if the document filed is a tracked document type and the case has due dates', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);

    await fileDocketEntryInteractor(applicationContext, {
      documentMetadata: {
        category: 'Application',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Application for Examination Pursuant to Rule 73',
        documentType: 'Application for Examination Pursuant to Rule 73',
        eventCode: 'AFE',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });

  it('does not send the service email if an error occurs while updating the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockRejectedValue(new Error('bad!'));

    let error;
    try {
      await fileDocketEntryInteractor(applicationContext, {
        documentMetadata: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error('bad!'));
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toBeCalled();
  });
});
