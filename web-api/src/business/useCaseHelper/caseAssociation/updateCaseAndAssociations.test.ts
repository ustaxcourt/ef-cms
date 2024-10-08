/* eslint-disable max-lines */
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock('@shared/business/entities/Message.ts');
jest.mock('@shared/business/entities/CaseDeadline');
jest.mock('@web-api/persistence/postgres/messages/getMessagesByDocketNumber');
jest.mock('@web-api/persistence/postgres/messages/updateMessage');
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { CaseDeadline } from '../../../../../shared/src/business/entities/CaseDeadline';
import { DOCKET_NUMBER_SUFFIXES } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_DOCUMENTS } from '../../../../../shared/src/test/mockDocketEntry';
import { MOCK_TRIAL_INPERSON } from '../../../../../shared/src/test/mockTrial';
import { MOCK_WORK_ITEM } from '../../../../../shared/src/test/mockWorkItem';
import { Message } from '../../../../../shared/src/business/entities/Message';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { docketClerkUser } from '../../../../../shared/src/test/mockUsers';
import { getMessagesByDocketNumber as getMessagesByDocketNumberMock } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { getWorkItemsByDocketNumber as getWorkItemsByDocketNumberMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { saveWorkItem as saveWorkItemMock } from '@web-api/persistence/postgres/workitems/saveWorkItem';
import { updateCaseAndAssociations } from './updateCaseAndAssociations';
import { updateMessage as updateMessageMock } from '@web-api/persistence/postgres/messages/updateMessage';

const getMessagesByDocketNumber = getMessagesByDocketNumberMock as jest.Mock;
const updateMessage = updateMessageMock as jest.Mock;
const saveWorkItem = saveWorkItemMock as jest.Mock;
const getWorkItemsByDocketNumber = getWorkItemsByDocketNumberMock as jest.Mock;

describe('updateCaseAndAssociations', () => {
  let updateCaseMock = jest.fn();
  let validMockCase;

  beforeAll(() => {
    validMockCase = new Case(
      {
        ...MOCK_CASE,
        archivedCorrespondences: [
          {
            correspondenceId: '95a84f02-23e6-4fff-9770-41f655f972a3',
            documentTitle: 'Inverted Yield Curve',
            filedByRole: docketClerkUser.role,
            userId: docketClerkUser.userId,
          },
        ],
        correspondence: [
          {
            correspondenceId: 'b7a6b14a-e4bd-4a20-9b6a-83674b36a162',
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
    (Message.validateRawCollection as jest.Mock).mockImplementation(
      collection => collection,
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(validMockCase);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(updateCaseMock);
  });

  it('gets the old case before passing it to updateCase persistence method', async () => {
    const caseToUpdate = {
      ...validMockCase,
    };
    const oldCase = {
      ...validMockCase,
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(oldCase);

    await updateCaseAndAssociations({
      applicationContext,
      authorizedUser: undefined,
      caseToUpdate,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0],
    ).toMatchObject({ applicationContext, caseToUpdate });
  });

  it('always sends valid entities to the updateCase persistence method', async () => {
    await updateCaseAndAssociations({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseToUpdate: validMockCase,
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(updateCaseMock).toHaveBeenCalled();
    const updateArgs = updateCaseMock.mock.calls[0][0];

    expect(updateArgs.caseToUpdate.isValidated).toBe(true);
  });

  it('does not attempt to make any update calls to persistence if any queries to persistence fail', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockRejectedValueOnce(
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
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).not.toHaveBeenCalled();

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
    expect(
      applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
    ).not.toHaveBeenCalled();

    // updatePrivatePractitioners
    expect(
      applicationContext.getPersistenceGateway()
        .removePrivatePractitionerOnCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .updatePrivatePractitionerOnCase,
    ).not.toHaveBeenCalled();

    // updateCaseWorkItems
    expect(saveWorkItem).not.toHaveBeenCalled();

    // updateUserCaseMappings
    expect(
      applicationContext.getPersistenceGateway().updateUserCaseMapping,
    ).not.toHaveBeenCalled();

    // updateCaseDeadlines
    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline,
    ).not.toHaveBeenCalled();

    // update the case itself, final persistence call
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
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

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(oldCase);

    await updateCaseAndAssociations({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseToUpdate,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0],
    ).toMatchObject({ applicationContext, caseToUpdate });
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
    it('does not call updateDocketEntry if all docket entries are unchanged', async () => {
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

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(caseToUpdate);

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate,
      });

      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0],
      ).toMatchObject({ applicationContext, caseToUpdate });
    });

    it('calls updateDocketEntry for each docket entry which has been added or changed', async () => {
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

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(oldCase);

      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate,
      });

      expect(
        applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
          .caseToUpdate.docketEntries,
      ).toMatchObject(caseToUpdate.docketEntries);
      expect(
        applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
          .caseToUpdate.archivedDocketEntries,
      ).toMatchObject(caseToUpdate.archivedDocketEntries);
      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry,
      ).toHaveBeenCalledTimes(4);
    });
  });

  describe('work items', () => {
    let updatedCase: Case;
    beforeAll(() => {
      getWorkItemsByDocketNumber.mockReturnValue([
        {
          pk: 'abc|987',
          sk: `workitem|${MOCK_WORK_ITEM.workItemId}`,
          ...MOCK_WORK_ITEM,
        },
      ]);
    });

    beforeEach(() => {
      updatedCase = cloneDeep(validMockCase);
    });

    it('does not call saveWorkItem if nothing on the case changes that requires a work item to be updated', async () => {
      updatedCase.mailingDate = '2025-01-05T05:22:16.001Z';
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: updatedCase,
      });
      expect(saveWorkItem).not.toHaveBeenCalled();
    });

    it('the associated judge has been updated', async () => {
      updatedCase.associatedJudge = 'Judge Dredd';
      updatedCase.associatedJudgeId = '2f46a889-901c-4e8b-b2bb-c3994e2c75c1';
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: updatedCase,
      });
      const { workItem } = saveWorkItem.mock.calls[0][0];
      expect(workItem.associatedJudge).toBe('Judge Dredd');
      expect(workItem.associatedJudgeId).toBe(
        '2f46a889-901c-4e8b-b2bb-c3994e2c75c1',
      );
    });
  });

  describe('correspondences', () => {
    it('does not call updateCaseCorrespondence if all correspondences are unchanged', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(validMockCase);
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
            documentTitle: 'Updated Archived Correspondence',
          },
          {
            correspondenceId: applicationContext.getUniqueId(),
            documentTitle: 'New Archived Correspondence',
            userId: applicationContext.getUniqueId(),
          },
        ],
        correspondence: [
          {
            ...validMockCase.correspondence[0],
            documentTitle: 'Updated Correspondence',
          },
          {
            correspondenceId: applicationContext.getUniqueId(),
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

      expect(
        applicationContext.getPersistenceGateway().updateCaseCorrespondence,
      ).toHaveBeenCalledTimes(4);
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
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCaseWithIrsPractitioners);
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
      expect(
        applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase,
      ).not.toHaveBeenCalled();
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

      expect(
        applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase
          .mock.calls[0][0],
      ).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        practitioner: updatedPractitioner,
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

      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase
          .mock.calls[0][0],
      ).toMatchObject({
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

      expect(
        applicationContext.getPersistenceGateway()
          .removePrivatePractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase
          .mock.calls[0][0],
      ).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        practitioner: mockCaseWithIrsPractitioners.irsPractitioners![0],
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
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          mockCaseWithIrsAndPrivatePractitioners,
        );
    });

    it('does not call updatePrivatePractitionerOnCase or removePrivatePractitionerOnCase if all private practitioners are unchanged', async () => {
      await updateCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToUpdate: mockCaseWithIrsAndPrivatePractitioners,
      });
      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .removePrivatePractitionerOnCase,
      ).not.toHaveBeenCalled();
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

      expect(
        applicationContext.getPersistenceGateway()
          .removePrivatePractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase.mock.calls[0][0],
      ).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        practitioner: updatedPractitioner,
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

      expect(
        applicationContext.getPersistenceGateway()
          .removePrivatePractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase.mock.calls[0][0],
      ).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        practitioner:
          mockCaseWithIrsAndPrivatePractitioners.privatePractitioners![0],
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

      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .removePrivatePractitionerOnCase,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway()
          .removePrivatePractitionerOnCase.mock.calls[0][0],
      ).toMatchObject({
        docketNumber: validMockCase.docketNumber,
        userId: practitionerId,
      });
    });
  });

  describe('user case messages', () => {
    beforeAll(() => {
      const mockMessages = [{ messageId: 'abc' }];
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
      const mockValidatorRejects = () => {
        throw new Error('Message entity was invalid mock-implementation');
      };
      (Message.validateRawCollection as jest.Mock).mockImplementationOnce(
        mockValidatorRejects,
      );
      await expect(
        updateCaseAndAssociations({
          applicationContext,
          authorizedUser: mockDocketClerkUser,
          caseToUpdate: {
            ...validMockCase,
            caseCaption: 'Some other caption',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            status: 'Submitted',
          },
        }),
      ).rejects.toThrow('entity was invalid');
      expect(getMessagesByDocketNumber).toHaveBeenCalled();
      expect(updateMessage).not.toHaveBeenCalled();
    });

    it('gets messages and persists them if valid', async () => {
      await expect(
        updateCaseAndAssociations({
          applicationContext,
          authorizedUser: mockDocketClerkUser,
          caseToUpdate: {
            ...validMockCase,
            caseCaption: 'Some other caption',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            status: 'Submitted',
          },
        }),
      ).resolves.not.toThrow();
      expect(getMessagesByDocketNumberMock).toHaveBeenCalled();
      expect(updateMessage).toHaveBeenCalled();
    });
  });

  describe('case deadlines', () => {
    const mockDeadline = new CaseDeadline(
      {},
      {
        applicationContext,
      },
    );
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(validMockCase);
      applicationContext
        .getPersistenceGateway()
        .getCaseDeadlinesByDocketNumber.mockReturnValue([
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
      expect(
        applicationContext.getPersistenceGateway()
          .getCaseDeadlinesByDocketNumber,
      ).not.toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCaseDeadline,
      ).not.toHaveBeenCalled();
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
      expect(
        applicationContext.getPersistenceGateway()
          .getCaseDeadlinesByDocketNumber,
      ).toHaveBeenCalled();
      expect(CaseDeadline.validateRawCollection).toHaveBeenCalled();
      expect(
        applicationContext.getPersistenceGateway().createCaseDeadline,
      ).toHaveBeenCalledWith({
        applicationContext,
        caseDeadline: { some: 'deadline' },
      });
    });
  });
});
