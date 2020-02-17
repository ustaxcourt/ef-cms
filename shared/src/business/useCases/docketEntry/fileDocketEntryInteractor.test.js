const {
  updateCaseAutomaticBlock,
} = require('../../useCaseHelper/automaticBlock/updateCaseAutomaticBlock');
const { Case } = require('../../entities/cases/Case');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { fileDocketEntryInteractor } = require('./fileDocketEntryInteractor');
const { User } = require('../../entities/User');

describe('fileDocketEntryInteractor', () => {
  let applicationContext;
  let user;
  const saveWorkItemForDocketClerkFilingExternalDocumentSpy = jest.fn();
  const saveWorkItemForDocketEntryWithoutFileSpy = jest.fn();
  const saveWorkItemForNonPaperSpy = jest.fn();
  const updateCaseSpy = jest.fn().mockImplementation(v => v);
  const deleteCaseTrialSortMappingRecordsSpy = jest.fn();
  let getCaseDeadlinesByCaseIdSpy;

  let caseRecord;

  beforeEach(() => {
    jest.clearAllMocks();

    getCaseDeadlinesByCaseIdSpy = jest.fn().mockReturnValue([]);

    user = {
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    caseRecord = {
      caseCaption: 'Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
      contactPrimary: {
        name: 'Guy Fieri',
      },
      createdAt: '',
      docketNumber: '45678-18',
      documents: [
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'respondent',
        },
      ],
      filingType: 'Myself',
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: deleteCaseTrialSortMappingRecordsSpy,
        getCaseByCaseId: async () => caseRecord,
        getCaseDeadlinesByCaseId: getCaseDeadlinesByCaseIdSpy,
        getUserById: async () => user,
        saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
        saveWorkItemForDocketEntryWithoutFile: saveWorkItemForDocketEntryWithoutFileSpy,
        saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => ({ updateCaseAutomaticBlock }),
    };
  });

  it('should throw an error if not authorized', async () => {
    user = {
      name: 'Olivia Jade',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await expect(
      fileDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISL',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('add documents but not workitems for paper filed documents', async () => {
    await fileDocketEntryInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISL',
        isPaper: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(saveWorkItemForNonPaperSpy).not.toBeCalled();
    expect(updateCaseSpy).toBeCalled();
  });

  it('sets the eventCode to MISL when the document is lodged', async () => {
    await fileDocketEntryInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        lodged: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents[3].eventCode,
    ).toEqual('MISL');
  });

  it('sets the eventCode to MISL on any secondaryDocument', async () => {
    await fileDocketEntryInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISL',
        lodged: true,
        secondaryDocument: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISL',
        },
        secondarySupportingDocumentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISL',
        },
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      secondaryDocumentFileId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
      secondarySupportingDocumentFileId: 'e54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents[4],
    ).toMatchObject({
      eventCode: 'MISL',
      lodged: true,
    });
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents[5],
    ).toMatchObject({
      eventCode: 'MISL',
      lodged: true,
    });
  });

  it('sets the case as blocked if the document filed is a tracked document type', async () => {
    await fileDocketEntryInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        category: 'Application',
        documentTitle: 'Application for Examination Pursuant to Rule 73',
        documentType: 'Application for Examination Pursuant to Rule 73',
        eventCode: 'AFE',
        isPaper: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(updateCaseSpy).toBeCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(deleteCaseTrialSortMappingRecordsSpy).toBeCalled();
  });

  it('sets the case as blocked with due dates if the document filed is a tracked document type and the case has due dates', async () => {
    getCaseDeadlinesByCaseIdSpy = jest
      .fn()
      .mockReturnValue([{ deadline: 'something' }]);
    await fileDocketEntryInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        category: 'Application',
        documentTitle: 'Application for Examination Pursuant to Rule 73',
        documentType: 'Application for Examination Pursuant to Rule 73',
        eventCode: 'AFE',
        isPaper: true,
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(updateCaseSpy).toBeCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(deleteCaseTrialSortMappingRecordsSpy).toBeCalled();
  });
});
