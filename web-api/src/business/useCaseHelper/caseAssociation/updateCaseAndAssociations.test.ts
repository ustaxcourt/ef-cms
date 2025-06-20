import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
jest.mock('@shared/business/entities/CaseDeadline');
jest.mock('@web-api/persistence/postgres/messages/getMessagesByDocketNumber');
jest.mock('@web-api/persistence/postgres/messages/updateMessage');
import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getMessagesByDocketNumber as getMessagesByDocketNumberMock } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseAndAssociations } from './updateCaseAndAssociations';
import { updateMessage as updateMessageMock } from '@web-api/persistence/postgres/messages/updateMessage';
import { upsertCaseCorrespondences as upsertCaseCorrespondencesMock } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { associateUserWithCase as associateUserWithCaseMock } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';
import { disassociateUserFromCase as deleteUserFromCaseMock } from '@web-api/persistence/postgres/users/cases/disassociateUserFromCase';
import { MOCK_MESSAGE } from '@shared/test/mockMessage';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { MOCK_WORK_ITEM } from '@shared/test/mockWorkItem';

describe('updateCaseAndAssociations', () => {
  let validMockCase;

  const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const upsertCases = jest.mocked(upsertCasesMock);
  const getMessagesByDocketNumber = getMessagesByDocketNumberMock as jest.Mock;
  const updateMessage = updateMessageMock as jest.Mock;
  const upsertCaseDeadlines = upsertCaseDeadlinesMock as jest.Mock;
  const getCaseDeadlinesByDocketNumber =
    getCaseDeadlinesByDocketNumberMock as jest.Mock;
  const upsertCaseCorrespondences = upsertCaseCorrespondencesMock as jest.Mock;
  const associateUserWithCase = associateUserWithCaseMock as jest.Mock;
  const deleteUserFromCase = deleteUserFromCaseMock as jest.Mock;

  beforeAll(() => {
    validMockCase = new Case(
      {
        ...MOCK_CASE,
        archivedCorrespondences: [
          {
            correspondenceId: '95a84f02-23e6-4fff-9770-41f655f972a3',
            docketNumber: MOCK_CASE.docketNumber,
            documentTitle: 'Inverted Yield Curve',
            filedByRole: docketClerkUser.role,
            userId: docketClerkUser.userId,
          },
        ],
        correspondence: [
          {
            correspondenceId: 'b7a6b14a-e4bd-4a20-9b6a-83674b36a162',
            docketNumber: MOCK_CASE.docketNumber,
            documentTitle: 'Deflationary Spending',
            filedByRole: docketClerkUser.role,
            userId: docketClerkUser.userId,
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    )
      .validate()
      .toRawObject();

    (CaseDeadline.validateRawCollection as jest.Mock).mockReturnValue([
      { some: 'deadline' },
    ]);
    getCaseByDocketNumber.mockResolvedValue(validMockCase);
  });

  beforeEach(() => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
  });

  it('gets the old case before passing it to updateCase persistence method', async () => {
    const caseToUpdate = {
      ...validMockCase,
    };
    const oldCase = {
      ...validMockCase,
    };
    getCaseByDocketNumber.mockResolvedValue(oldCase);

    await updateCaseAndAssociations({
      applicationContext,
      authorizedUser: undefined,
      caseToUpdate,
    });

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertCases).toHaveBeenCalled();

    expect(upsertCases.mock.calls[0][0]).toMatchObject([caseToUpdate]);
  });

  it('always sends valid entities to the updateCase persistence method', async () => {
    await updateCaseAndAssociations({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseToUpdate: validMockCase,
    });
    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertCases).toHaveBeenCalled();
    const updatedCase = upsertCases.mock.calls[0][0][0];

    // TODO: isValidated is not typed
    // @ts-ignore
    expect(updatedCase.isValidated).toBe(true);
  });

  it('does not attempt to make any update calls to persistence if any queries to persistence fail', async () => {
    getCaseDeadlinesByDocketNumber.mockRejectedValue(
      new Error('query problem'),
    );

    await expect(
      updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...validMockCase,
          associatedJudge: 'Judge Arnold',
          associatedJudgeId: '98d550c5-76d5-4f3a-9ce8-689b5c4a1b36',
        },
      }),
    ).rejects.toThrow('query problem');

    // updateCaseDocketEntries
    expect(upsertDocketEntries).not.toHaveBeenCalled();

    // updateCaseMessages
    expect(updateMessage).not.toHaveBeenCalled();

    // updateCorrespondence
    expect(
      applicationContext.getPersistenceGateway().updateCaseCorrespondence,
    ).not.toHaveBeenCalled();

    // updateHearings
    expect(
      applicationContext.getPersistenceGateway().removeCaseFromHearing,
    ).not.toHaveBeenCalled();

    // updateIrsPractitioners
    expect(deleteUserFromCase).not.toHaveBeenCalled();
    expect(associateUserWithCase).not.toHaveBeenCalled();

    // updatePrivatePractitioners
    expect(deleteUserFromCase).not.toHaveBeenCalled();
    expect(associateUserWithCase).not.toHaveBeenCalled();

    // updateUserCaseMappings
    expect(
      applicationContext.getPersistenceGateway().updateUserCaseMapping,
    ).not.toHaveBeenCalled();

    // updateCaseDeadlines
    expect(upsertCaseDeadlines).not.toHaveBeenCalled();

    // update the case itself, final persistence call
    expect(upsertCases).not.toHaveBeenCalled();
  });

  it('updates hearings, removing old ones from the given case', async () => {
    const trialSessionIds = [
      applicationContext.getUniqueId(),
      applicationContext.getUniqueId(),
      applicationContext.getUniqueId(),
    ];

    const { docketNumber } = validMockCase;
    const caseToUpdate = {
      ...validMockCase,
      docketNumber,
      hearings: [
        { ...MOCK_TRIAL_INPERSON, trialSessionId: trialSessionIds[0] },
      ],
    };
    const oldCase = {
      ...validMockCase,
      docketNumber,
      hearings: [
        { ...MOCK_TRIAL_INPERSON, trialSessionId: trialSessionIds[0] },
        { ...MOCK_TRIAL_INPERSON, trialSessionId: trialSessionIds[1] },
        { ...MOCK_TRIAL_INPERSON, trialSessionId: trialSessionIds[2] },
      ],
    };

    getCaseByDocketNumber.mockResolvedValue(oldCase);

    await updateCaseAndAssociations({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseToUpdate,
    });

    expect(upsertCases.mock.calls[0][0]).toMatchObject([caseToUpdate]);
    expect(
      applicationContext.getPersistenceGateway().removeCaseFromHearing,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().removeCaseFromHearing.mock
        .calls,
    ).toMatchObject([
      [{ docketNumber, trialSessionId: trialSessionIds[1] }],
      [{ docketNumber, trialSessionId: trialSessionIds[2] }],
    ]);
  });

  describe('docket entries', () => {
    it('does not call upsertDocketEntries if all docket entries are unchanged', async () => {
      const oldCase = {
        ...validMockCase,
        archivedDocketEntries: MOCK_DOCUMENTS,
        docketEntries: MOCK_DOCUMENTS,
      };
      const caseToUpdate = {
        ...oldCase,
        archivedDocketEntries: MOCK_DOCUMENTS,
        docketEntries: MOCK_DOCUMENTS,
      };

      getCaseByDocketNumber.mockResolvedValue(caseToUpdate);

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate,
      });

      expect(upsertDocketEntries).toHaveBeenCalledWith([]);
      expect(upsertCases.mock.calls[0][0]).toMatchObject([caseToUpdate]);
    });

    it('calls upsertDocketEntries for each docket entry which has been added or changed', async () => {
      const oldCase = {
        ...MOCK_CASE,
        archivedDocketEntries: [MOCK_DOCUMENTS[0]],
        docketEntries: [MOCK_DOCUMENTS[0]],
      };

      const caseToUpdate = {
        ...oldCase,
        archivedDocketEntries: [
          { ...MOCK_DOCUMENTS[0], documentTitle: 'Updated Archived Entry' },
          { ...MOCK_DOCUMENTS[1], documentTitle: 'New Archived Entry' },
        ],
        docketEntries: [
          { ...MOCK_DOCUMENTS[0], documentTitle: 'Updated Docket Entry' },
          { ...MOCK_DOCUMENTS[1], documentTitle: 'New Docket Entry' },
        ],
      };

      getCaseByDocketNumber.mockResolvedValue(oldCase);

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate,
      });

      expect(upsertCases.mock.calls[0][0][0].docketEntries).toMatchObject(
        caseToUpdate.docketEntries,
      );
      expect(
        upsertCases.mock.calls[0][0][0].archivedDocketEntries,
      ).toMatchObject(caseToUpdate.archivedDocketEntries);
      expect(upsertDocketEntries).toHaveBeenCalledTimes(1);
    });

    it('should not compare work item differences when comparing docket entries', async () => {
      const oldCase = {
        ...validMockCase,
        archivedDocketEntries: MOCK_DOCUMENTS,
        docketEntries: MOCK_DOCUMENTS.map(d => ({
          ...d,
          workItem: MOCK_WORK_ITEM,
        })),
      };
      const caseToUpdate = {
        ...oldCase,
        archivedDocketEntries: MOCK_DOCUMENTS,
        docketEntries: MOCK_DOCUMENTS.map(d => ({
          ...d,
          workItem: undefined,
        })),
      };

      getCaseByDocketNumber.mockResolvedValue(caseToUpdate);

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate,
      });

      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry,
      ).not.toHaveBeenCalled();
    });
  });

  describe('correspondences', () => {
    it('does not call updateCaseCorrespondence if all correspondences are unchanged', async () => {
      getCaseByDocketNumber.mockResolvedValue(validMockCase);
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: validMockCase,
      });
      expect(
        applicationContext.getPersistenceGateway().updateCaseCorrespondence,
      ).not.toHaveBeenCalled();
    });

    it('calls updateCaseCorrespondence for each correspondence which has been added or changed', async () => {
      const caseToUpdate = {
        ...validMockCase,
        archivedCorrespondences: [
          {
            ...validMockCase.archivedCorrespondences[0],
            docketNumber: validMockCase.docketNumber,
            documentTitle: 'Updated Archived Correspondence',
          },
          {
            correspondenceId: applicationContext.getUniqueId(),
            docketNumber: validMockCase.docketNumber,
            documentTitle: 'New Archived Correspondence',
            userId: applicationContext.getUniqueId(),
          },
        ],
        correspondence: [
          {
            ...validMockCase.correspondence[0],
            docketNumber: validMockCase.docketNumber,
            documentTitle: 'Updated Correspondence',
          },
          {
            correspondenceId: applicationContext.getUniqueId(),
            docketNumber: validMockCase.docketNumber,
            documentTitle: 'New Correspondence',
            userId: applicationContext.getUniqueId(),
          },
        ],
      };

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate,
      });

      expect(upsertCaseCorrespondences).toHaveBeenCalledTimes(1);
    });
  });

  describe('IRS practitioners', () => {
    const practitionerId = applicationContext.getUniqueId();
    const mockCaseWithIrsPractitioners = new Case(
      {
        ...MOCK_CASE,
        irsPractitioners: [
          {
            barNumber: 'BT007',
            name: 'Bobby Tables',
            role: 'irsPractitioner',
            userId: practitionerId,
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    beforeAll(() => {
      getCaseByDocketNumber.mockResolvedValue(mockCaseWithIrsPractitioners);
    });

    it('does not call updateIrsPractitionerOnCase or removeIrsPractitionerOnCase if all IRS practitioners are unchanged', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: mockCaseWithIrsPractitioners,
      });
      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(deleteUserFromCase).not.toHaveBeenCalled();
    });

    it('calls updateIrsPractitionerOnCase on changed entries in irsPractitioners', async () => {
      const updatedPractitioner = {
        barNumber: 'BT007',
        name: 'Robert Jables', // changed name
        role: 'irsPractitioner',
        userId: practitionerId,
      };
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...mockCaseWithIrsPractitioners,
          irsPractitioners: [updatedPractitioner],
        },
      });

      expect(deleteUserFromCase).not.toHaveBeenCalled();
      expect(associateUserWithCase).toHaveBeenCalled();
      expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });

    it('removes an irsPractitioner from a case with existing irsPractitioners', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...mockCaseWithIrsPractitioners,
          irsPractitioners: [],
        },
      });

      expect(associateUserWithCase).not.toHaveBeenCalled();
      expect(deleteUserFromCase).toHaveBeenCalled();
      expect(deleteUserFromCase.mock.calls[0][0]).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });

    it('calls updateIrsPractitionerOnCase to update gsi1pk for unchanged irsPractitioners when the case is part of a consolidated group', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...mockCaseWithIrsPractitioners,
          leadDocketNumber: '101-23',
        },
      });

      expect(deleteUserFromCase).not.toHaveBeenCalled();
      expect(associateUserWithCase).toHaveBeenCalled();
      expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });
  });

  describe('Private practitioners', () => {
    const practitionerId = applicationContext.getUniqueId();
    const mockCaseWithIrsAndPrivatePractitioners = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'BT007',
            name: 'Billie Jean',
            role: 'privatePractitioner',
            userId: practitionerId,
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    beforeAll(() => {
      getCaseByDocketNumber.mockResolvedValue(
        mockCaseWithIrsAndPrivatePractitioners,
      );
    });

    it('does not call updatePrivatePractitionerOnCase or deleteUserFromCase if all private practitioners are unchanged', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: mockCaseWithIrsAndPrivatePractitioners,
      });
      expect(associateUserWithCase).not.toHaveBeenCalled();
      expect(deleteUserFromCase).not.toHaveBeenCalled();
    });

    it('calls updatePrivatePractitionerOnCase on changed entries in privatePractitioners', async () => {
      const updatedPractitioner = {
        barNumber: 'BT007',
        name: 'William Denim', // changed name
        role: 'privatePractitioner',
        userId: practitionerId,
      };
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...mockCaseWithIrsAndPrivatePractitioners,
          privatePractitioners: [updatedPractitioner],
        },
      });

      expect(deleteUserFromCase).not.toHaveBeenCalled();
      expect(associateUserWithCase).toHaveBeenCalled();
      expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });

    it('calls updatePrivatePractitionerOnCase to update gsi1pk for unchanged privatePractitioners when the case is part of a consolidated group', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...mockCaseWithIrsAndPrivatePractitioners,
          leadDocketNumber: '101-23',
        },
      });

      expect(deleteUserFromCase).not.toHaveBeenCalled();
      expect(associateUserWithCase).toHaveBeenCalled();
      expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });

    it('removes an privatePractitioner from a case with existing privatePractitioners', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...mockCaseWithIrsAndPrivatePractitioners,
          privatePractitioners: [],
        },
      });

      expect(associateUserWithCase).not.toHaveBeenCalled();
      expect(deleteUserFromCase).toHaveBeenCalled();
      expect(deleteUserFromCase.mock.calls[0][0]).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });
  });

  describe('user case messages', () => {
    beforeAll(() => {
      const mockMessages = [MOCK_MESSAGE];
      updateMessage.mockResolvedValue(true);
      getMessagesByDocketNumber.mockResolvedValue(mockMessages);
    });
    it('completes without altering message records if no message updates are necessary', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: validMockCase,
      });
      expect(getMessagesByDocketNumber).not.toHaveBeenCalled();
      expect(updateMessage).not.toHaveBeenCalled();
    });

    it('gets messages and throws validation errors if updates are not valid', async () => {
      getMessagesByDocketNumber.mockResolvedValue([
        { isValidMessage: 'Nope!' },
      ]);
      await expect(
        updateCaseAndAssociations({
          applicationContext,
          authorizedUser: mockDocketClerkUser,
          caseToUpdate: {
            ...validMockCase,
            caseType: CASE_TYPES_MAP.whistleblower, // This will change the docketNumberSuffix
          },
        }),
      ).rejects.toThrow('entity was invalid');
      expect(getMessagesByDocketNumber).toHaveBeenCalled();
      expect(updateMessage).not.toHaveBeenCalled();
    });

    it('gets messages and persists them if valid', async () => {
      getCaseByDocketNumber.mockResolvedValue({ ...MOCK_CASE });
      getMessagesByDocketNumber.mockResolvedValue([MOCK_MESSAGE]);

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: {
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.whistleblower, // This will change the docketNumberSuffix
        },
      });
      expect(getMessagesByDocketNumberMock).toHaveBeenCalled();
      expect(updateMessage).toHaveBeenCalled();
    });
  });

  describe('case deadlines', () => {
    const mockDeadline = new CaseDeadline({});
    beforeAll(() => {
      getCaseByDocketNumber.mockResolvedValue(validMockCase);
      getCaseDeadlinesByDocketNumber.mockReturnValue([
        { ...mockDeadline, pk: 'abc|987', sk: 'user-case|123' },
      ]);
    });

    it('should not fetch or persist any case deadline data if associated judge is unchanged', async () => {
      const updatedCase = {
        ...validMockCase,
      };
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: updatedCase,
      });
      expect(getCaseDeadlinesByDocketNumber).not.toHaveBeenCalled();
      expect(upsertCaseDeadlines).not.toHaveBeenCalled();
    });

    it('should fetch and persist case deadline data when associated judge has changed', async () => {
      const updatedCase = {
        ...validMockCase,
        associatedJudge: 'Judge Phoebe Judge',
        associatedJudgeId: '5f38a63a-17c9-4c02-b376-8123b0f26d9a',
      };
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: updatedCase,
      });
      expect(getCaseDeadlinesByDocketNumber).toHaveBeenCalled();
      expect(CaseDeadline.validateRawCollection).toHaveBeenCalled();
      expect(upsertCaseDeadlines).toHaveBeenCalledWith([{ some: 'deadline' }]);
    });
  });
});
