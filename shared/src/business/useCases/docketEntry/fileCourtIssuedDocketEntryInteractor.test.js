const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_SECTION,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
} = require('../../entities/EntityConstants');
const {
  fileCourtIssuedDocketEntryInteractor,
} = require('./fileCourtIssuedDocketEntryInteractor');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('fileCourtIssuedDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();
  const docketClerkUser = {
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: mockUserId,
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        {
          docketEntryId: 'a01afa63-931e-4999-99f0-c892c51292d6',
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
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileCourtIssuedDocketEntryInteractor(applicationContext, {
        documentMeta: {
          docketEntryId: caseRecord.docketEntries[1].docketEntryId,
          docketNumber: caseRecord.docketNumber,
          documentType: 'Memorandum in Support',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    await expect(
      fileCourtIssuedDocketEntryInteractor(applicationContext, {
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
        },
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error if the document has already been added to the docket record', async () => {
    caseRecord.docketEntries[1].isOnDocketRecord = true;

    await expect(
      fileCourtIssuedDocketEntryInteractor(applicationContext, {
        documentMeta: {
          docketEntryId: caseRecord.docketEntries[1].docketEntryId,
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
        },
      }),
    ).rejects.toThrow('Docket entry has already been added to docket record');
  });

  it('should call countPagesInDocument, updateCase, and saveWorkItem', async () => {
    await fileCourtIssuedDocketEntryInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
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
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should call updateCase with the docket entry set as pending if the document is a tracked document', async () => {
    await fileCourtIssuedDocketEntryInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        filingDate: '2011-03-01T21:40:46.415Z',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    const { caseToUpdate } =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];
    const docketEntryInCaseToUpdate = caseToUpdate.docketEntries.find(
      d => d.docketEntryId === caseRecord.docketEntries[1].docketEntryId,
    );
    expect(docketEntryInCaseToUpdate).toMatchObject({
      docketEntryId: caseRecord.docketEntries[1].docketEntryId,
      filingDate: '2011-03-01T21:40:46.415Z',
      pending: true,
    });
  });

  it('should set isDraft to false on a document when creating a court issued docket entry', async () => {
    await fileCourtIssuedDocketEntryInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: caseRecord.docketEntries[2].docketEntryId,
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

    const newlyFiledDocument =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[lastDocumentIndex];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: false,
    });
  });

  it('should delete the draftOrderState from the docketEntry', async () => {
    const docketEntryToUpdate = caseRecord.docketEntries[2];
    await fileCourtIssuedDocketEntryInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: docketEntryToUpdate.docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: docketEntryToUpdate.documentTitle,
        documentType: docketEntryToUpdate.documentType,
        draftOrderState: {
          documentContents: 'Some content',
          richText: 'some content',
        },
        eventCode: docketEntryToUpdate.eventCode,
      },
    });

    const updatedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.docketEntryId === docketEntryToUpdate.docketEntryId,
      );

    expect(updatedDocketEntry).toMatchObject({ draftOrderState: null });
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await fileCourtIssuedDocketEntryInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        serviceStamp: 'Served',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: Case.getCaseTitle(caseRecord.caseCaption),
    });
  });
});
