/* eslint-disable max-lines */
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { getDocumentQCInboxForSection as getDocumentQCInboxForSectionMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForSection';
import { getDocumentQCInboxForUser as getDocumentQCInboxForUserMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { getNotificationsInteractor } from './getNotificationsInteractor';
import { getSectionInboxMessages as getSectionInboxMessagesMock } from '@web-api/persistence/postgres/messages/getSectionInboxMessages';
import { getUserInboxMessages as getUserInboxMessagesMock } from '@web-api/persistence/postgres/messages/getUserInboxMessages';
import {
  mockAdcUser,
  mockDocketClerkUser,
  mockJudgeUser,
} from '@shared/test/mockAuthUsers';

const getUserInboxMessages = getUserInboxMessagesMock as jest.Mock;
const getSectionInboxMessages = getSectionInboxMessagesMock as jest.Mock;
const getDocumentQCInboxForUser = getDocumentQCInboxForUserMock as jest.Mock;
const getDocumentQCInboxForSection =
  getDocumentQCInboxForSectionMock as jest.Mock;

const mockDocketEntryId1 = 'entry-1';
const mockDocketEntryId2 = 'entry-2';
const mockDocketEntryId3 = 'entry-3';
const mockDocketEntryId4 = 'entry-4';
const mockDocketEntryId5 = 'entry-5';
const mockDocketEntryId6 = 'entry-6';

const mockQCWorkItems = [
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: true,
    },
    docketEntryId: mockDocketEntryId1,
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Carey',
    docketEntry: {
      isFileAttached: true,
    },
    docketEntryId: mockDocketEntryId2,
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: CHIEF_JUDGE,
    docketEntry: {
      isFileAttached: true,
    },
    docketEntryId: mockDocketEntryId3,
    isRead: true,
    section: PETITIONS_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: true,
    },
    docketEntryId: mockDocketEntryId4,
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: false,
    },
    docketEntryId: mockDocketEntryId5,
    inProgress: true,
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: false,
    },
    docketEntryId: mockDocketEntryId6,
    isRead: true,
    section: PETITIONS_SECTION,
  },
];

describe('getNotificationsInteractor', () => {
  beforeEach(() => {
    getUserInboxMessages.mockReturnValue([
      {
        isRead: true,
        messageId: 'message-id-1',
      },
    ]);

    getSectionInboxMessages.mockReturnValue([
      {
        messageId: 'message-id-1',
      },
      {
        messageId: 'message-id-2',
      },
    ]);

    getDocumentQCInboxForSection.mockReturnValue(mockQCWorkItems);

    getDocumentQCInboxForUser.mockReturnValue([
      ...mockQCWorkItems,
      { ...mockQCWorkItems[0], isRead: false },
    ]);
  });

  it('should throw an error when the user does not have permission to get notifications', async () => {
    await expect(
      getNotificationsInteractor(
        applicationContext,
        {
          judgeId: '123456',
          section: DOCKET_SECTION,
        },
        undefined,
      ),
    ).rejects.toThrow();
  });

  it('should return all notification counts', async () => {
    getDocumentQCInboxForUser.mockReturnValueOnce([
      {
        assigneeId: mockDocketClerkUser.userId,
        docketEntry: { isFileAttached: true },
        docketEntryId: mockDocketEntryId1,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: '123456',
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result).toEqual({
      qcIndividualInProgressCount: 0,
      qcIndividualInboxCount: 1,
      qcSectionInProgressCount: 1,
      qcSectionInboxCount: 3,
      unreadMessageCount: 0,
      userInboxCount: 1,
      userSectionCount: 2,
    });
  });

  it('should return qcIndividualInProgressCount', async () => {
    getDocumentQCInboxForUser.mockReturnValueOnce([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInProgressCount).toEqual(1);
  });

  it('should return qcIndividualInboxCount', async () => {
    getDocumentQCInboxForUser.mockReturnValueOnce([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: false,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInboxCount).toEqual(1);
  });

  it('should return qcSectionInProgressCount', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        docketEntryId: mockDocketEntryId1,
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        docketEntryId: mockDocketEntryId2,
        inProgress: true,
        isRead: true,
        section: PETITIONS_SECTION,
      },
      {
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        docketEntryId: mockDocketEntryId3,
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        docketEntryId: mockDocketEntryId4,
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        docketEntryId: mockDocketEntryId5,
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInProgressCount).toEqual(2);
  });

  it('should return qcSectionInboxCount', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: PETITIONS_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInboxCount).toEqual(1);
  });

  it('should return qcSection counts when inbox is undefined', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce(undefined);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: '123456',
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInProgressCount).toEqual(0);
    expect(result.qcSectionInboxCount).toEqual(0);
  });

  it('should return messages for selectedSection when specified', async () => {
    const filteredWorkItem = {
      associatedJudge: 'Judge Barker',
      docketEntry: {
        isFileAttached: true,
      },
      inProgress: false,
      isRead: true,
      section: PETITIONS_SECTION,
      caseStatus: CASE_STATUS_TYPES.new,
    };
    const SELECTED_SECTION = PETITIONS_SECTION;

    getDocumentQCInboxForSection.mockReturnValueOnce([filteredWorkItem]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        selectedSection: SELECTED_SECTION,
        section: DOCKET_SECTION,
        judgeId: undefined,
      },
      mockAdcUser,
    );

    expect(getUserInboxMessages.mock.calls[0][0].userId).toEqual(
      mockAdcUser.userId,
    );
    expect(getSectionInboxMessages.mock.calls[0][0].section).toEqual(
      SELECTED_SECTION,
    );
    expect(getDocumentQCInboxForSection.mock.calls[0][0].section).toEqual(
      PETITIONS_SECTION,
    );

    expect(result.qcSectionInboxCount).toEqual(1);
  });

  it('should return unreadMessageCount', async () => {
    getUserInboxMessages.mockReturnValueOnce([
      { isRead: false, messageId: 'message-id-1' },
      { isRead: true, messageId: 'message-id-2' },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      { judgeId: '890809', section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(result.unreadMessageCount).toEqual(1);
    expect(result.userInboxCount).toEqual(2);
  });

  it('should return qc section items for the provided judgeId', async () => {
    await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeId: mockJudgeUser.userId,
      section: DOCKET_SECTION,
    });
  });

  it('should return qc section items without judgeId when not provided', async () => {
    await getNotificationsInteractor(
      applicationContext,
      { judgeId: undefined, section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeId: undefined,
      section: DOCKET_SECTION,
    });
  });

  it('should return qc section items with null judgeId for ADC user', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce([]);

    await getNotificationsInteractor(
      applicationContext,
      { judgeId: mockJudgeUser.userId, section: DOCKET_SECTION },
      mockAdcUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeId: null,
      section: DOCKET_SECTION,
    });
  });

  it('should count one item per consolidated group with populated multiDocketedOn arrays in qcSectionInboxCount', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '100-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: { isFileAttached: true },
        docketEntryId: mockDocketEntryId2,
        docketNumber: '103-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInboxCount).toEqual(2);
  });

  it('should count one item per consolidated group with populated multiDocketedOn arrays in qcSectionInProgressCount', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '100-20',
        leadDocketNumber: '100-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: { isFileAttached: false },
        docketEntryId: mockDocketEntryId2,
        docketNumber: '103-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInProgressCount).toEqual(2);
  });

  it('should count one item per consolidated group with populated multiDocketedOn arrays in qcIndividualInboxCount', async () => {
    getDocumentQCInboxForUser.mockReturnValueOnce([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '100-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: { isFileAttached: true },
        docketEntryId: mockDocketEntryId2,
        docketNumber: '103-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInboxCount).toEqual(2);
  });

  it('should count one item per consolidated group with populated multiDocketedOn arrays in qcIndividualInProgressCount', async () => {
    getDocumentQCInboxForUser.mockReturnValueOnce([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '100-20',
        leadDocketNumber: '100-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: { isFileAttached: false },
        docketEntryId: mockDocketEntryId2,
        docketNumber: '103-20',
        inProgress: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInProgressCount).toEqual(2);
  });

  it('should count one item per case in a consolidated group with populated multiDocketedOn arrays but lead case is missing in qcSectionInboxCount', async () => {
    getDocumentQCInboxForSection.mockReturnValueOnce([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '101-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
          multiDocketedOn: ['100-20', '101-20', '102-20'],
        },
        docketEntryId: mockDocketEntryId1,
        docketNumber: '102-20',
        leadDocketNumber: '100-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: { isFileAttached: true },
        docketEntryId: mockDocketEntryId2,
        docketNumber: '103-20',
        inProgress: false,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInboxCount).toEqual(2);
  });
});
