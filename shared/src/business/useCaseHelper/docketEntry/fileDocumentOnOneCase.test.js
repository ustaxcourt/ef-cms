/* eslint-disable max-lines */
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments,
  fileDocumentOnOneCase,
} = require('./fileDocumentOnOneCase');
const {
  DOCKET_SECTION,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  MOCK_CASE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} = require('../../../test/mockCase');
const { Case } = require('../../entities/cases/Case');
const { docketClerkUser, judgeUser } = require('../../../test/mockUsers');
const { DocketEntry } = require('../../entities/DocketEntry');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { WorkItem } = require('../../entities/WorkItem');

describe('fileDocumentOnOneCase', () => {
  let mockCaseEntity;
  let mockWorkItem;
  let mockDocketEntry;

  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';
  const differentDocketNumber = '3875-32';

  jest.spyOn(Case.prototype, 'addDocketEntry');
  jest.spyOn(Case.prototype, 'updateDocketEntry');
  jest.spyOn(DocketEntry.prototype, 'setAsServed');
  jest.spyOn(WorkItem.prototype, 'validate');
  jest.spyOn(WorkItem.prototype, 'assignToUser');
  jest.spyOn(WorkItem.prototype, 'setAsCompleted');

  beforeEach(() => {
    mockCaseEntity = new Case(MOCK_CASE, {
      applicationContext,
    });

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );

    mockWorkItem = {
      docketNumber: differentDocketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: mockWorkItem,
      },
      { applicationContext },
    );
  });

  it('should create a new work item for the docketEntry when it does not already have one', async () => {
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: undefined,
      },
      { applicationContext },
    );

    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.workItem).toBeDefined();
  });

  it('should create a new work item for the docketEntry when the docketNumber on the originalSubjectDocketEntry does not match the docketNumber of the case to file the docketEntry on', async () => {
    mockWorkItem = {
      docketNumber: differentDocketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };
    mockDocketEntry = new DocketEntry(
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockCaseEntity.docketNumber,
        documentType: 'Order',
        eventCode: 'O',
        judge: judgeUser.name,
        numberOfPages: 1,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
        workItem: mockWorkItem,
      },
      { applicationContext },
    );

    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      user: docketClerkUser,
    });

    const expectedDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        doc => doc.docketEntryId === mockDocketEntryId,
      );
    expect(expectedDocketEntry.workItem.docketNumber).toBe(
      mockCaseEntity.docketNumber,
    );
  });

  it('should set docketEntry.workItem.leadDocketNumber from caseEntity.leadDocketNumber', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          applicationContext,
        },
      ),
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem.leadDocketNumber,
    ).toBe(MOCK_CASE.docketNumber);
  });

  it('should assign the docketEntry`s work item to the provided user', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          applicationContext,
        },
      ),
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.assignToUser).toHaveBeenCalledWith({
      assigneeId: docketClerkUser.userId,
      assigneeName: docketClerkUser.name,
      section: docketClerkUser.section,
      sentBy: docketClerkUser.name,
      sentBySection: docketClerkUser.section,
      sentByUserId: docketClerkUser.userId,
    });
  });

  it('should set the docketEntry`s work item as completed by the provided user', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: new Case(
        { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber },
        {
          applicationContext,
        },
      ),
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.setAsCompleted).toHaveBeenCalledWith({
      message: 'completed',
      user: docketClerkUser,
    });
  });

  it('should update the docketEntry on the caseEntity when it already existed on the case', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.updateDocketEntry).toHaveBeenCalled();
  });

  it('should add the docketEntry on the caseEntity when it did NOT already exist on the case', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.addDocketEntry).toHaveBeenCalled();
  });

  it('should validate the docketEntry`s work item', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(WorkItem.prototype.validate).toHaveBeenCalled();
  });

  it('should make a call to save the docketEntry`s work item', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should make a call to put the docketEntry`s work item in the user`s outbox', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should make a call to close the case and update trial session information when the docketEntry being filed is one of "ENTERED_AND_SERVED_EVENT_CODES"', async () => {
    const a = new DocketEntry(
      {
        ...mockDocketEntry,
        docketEntryId: mockDocketEntryId,
        documentType: 'Order of Dismissal for Lack of Jurisdiction',
        eventCode: ENTERED_AND_SERVED_EVENT_CODES[0],
        judge: judgeUser.name,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: judgeUser.userId,
        signedJudgeName: judgeUser.name,
      },
      { applicationContext },
    );

    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: a,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(Case.prototype.closeCase).toHaveBeenCalled();
  });

  it('should make a call save the case', async () => {
    await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should return the updated case entity', async () => {
    const result = await fileDocumentOnOneCase({
      applicationContext,
      caseEntity: mockCaseEntity,
      docketEntryEntity: mockDocketEntry,
      subjectCaseDocketNumber: mockCaseEntity.docketNumber,
      user: docketClerkUser,
    });

    expect(result.entityName).toBe('Case');
    expect(
      result.getDocketEntryById({ docketEntryId: mockDocketEntryId }),
    ).toBeDefined();
  });

  describe('closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments', () => {
    const mockTrialSessionId = '414ca21e-1399-4a2f-8f24-06cad634f359';
    const mockTrialSession = {
      caseOrder: [],
      judge: {
        name: 'Judge Colvin',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      maxCases: 100,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      startDate: '2019-11-27T05:00:00.000Z',
      startTime: '10:00',
      swingSession: true,
      swingSessionId: mockTrialSessionId,
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Houston, Texas',
      trialSessionId: mockTrialSessionId,
    };

    jest.spyOn(Case.prototype, 'closeCase');
    jest.spyOn(TrialSession.prototype, 'removeCaseFromCalendar');
    jest.spyOn(TrialSession.prototype, 'deleteCaseFromCalendar');
    jest.spyOn(TrialSession.prototype, 'validate');

    it('should close the case', async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: mockCaseEntity,
      });

      expect(Case.prototype.closeCase).toHaveBeenCalled();
    });

    it('should make a call to delete the case trial sort mapping records', async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: mockCaseEntity,
      });

      expect(
        applicationContext.getPersistenceGateway()
          .deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
      ).toBe(mockCaseEntity.docketNumber);
    });

    it('should return early when the case does NOT have a trialSessionId set', async () => {
      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: undefined },
          { applicationContext },
        ),
      });

      expect(
        applicationContext.getPersistenceGateway().getTrialSessionById,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).not.toHaveBeenCalled();
    });

    it('should remove the case from the calendar when the trialSession it`s scheduled on is already calendared', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          isCalendared: true,
        });

      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
          { applicationContext },
        ),
      });

      expect(
        TrialSession.prototype.removeCaseFromCalendar,
      ).toHaveBeenCalledWith({
        disposition: 'Status was changed to Closed',
        docketNumber: mockCaseEntity.docketNumber,
      });
    });

    it('should delete the case from the calendar when the trialSession it`s scheduled on is NOT already calendared', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          isCalendared: false,
        });

      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
          { applicationContext },
        ),
      });

      expect(
        TrialSession.prototype.deleteCaseFromCalendar,
      ).toHaveBeenCalledWith({
        docketNumber: mockCaseEntity.docketNumber,
      });
    });

    it('should not persist the trial session changes when it`s not valid', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          proceedingType: null, // Required on TrialSession entity
        });

      await expect(
        closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
          applicationContext,
          caseEntity: new Case(
            { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
            { applicationContext },
          ),
        }),
      ).rejects.toThrow();

      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).not.toHaveBeenCalled();
    });

    it('should make a call to persist the changes to the trial session', async () => {
      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...mockTrialSession,
          isCalendared: false,
        });

      await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
        applicationContext,
        caseEntity: new Case(
          { ...MOCK_CASE, trialSessionId: mockTrialSessionId },
          { applicationContext },
        ),
      });

      expect(
        applicationContext.getPersistenceGateway().updateTrialSession,
      ).toHaveBeenCalled();
    });
  });
});
