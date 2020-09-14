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
  TRANSCRIPT_EVENT_CODE,
} = require('../../entities/EntityConstants');
const {
  fileCourtIssuedDocketEntryInteractor,
} = require('./fileCourtIssuedDocketEntryInteractor');

describe('fileCourtIssuedDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

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
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: '45678-18',
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: '45678-18',
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
        },
        {
          docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          docketNumber: '45678-18',
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          userId: mockUserId,
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '8100e22a-c7f2-4574-b4f6-eb092fca9f35',
    };
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Memorandum in Support',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      fileCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
        },
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should call countPagesInDocument, updateCase, createUserInboxRecord, and createSectionInboxRecord', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createUserInboxRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createSectionInboxRecord,
    ).toHaveBeenCalled();
  });

  it('should call updateCase and set the case as automatic blocked if the document is a tracked document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
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

  it('should call updateCase and set the case as automatic blocked with deadlines if the document is a tracked document and the case has deadlines', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        {
          deadlineDate: 'sometime',
        },
      ]);
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
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

  it('should set secondaryDate on the created document if the eventCode is TRAN', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[5],
    ).toMatchObject({
      secondaryDate: '2019-03-01T21:40:46.415Z',
    });
  });

  it('should set isDraft to false on a document when creating a court issued docket entry', async () => {
    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        isDraft: true,
      },
    });

    const lastDocumentIndex =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length - 1;

    const newlyFiledDocument = applicationContext.getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries[
      lastDocumentIndex
    ];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: false,
    });
  });
});
