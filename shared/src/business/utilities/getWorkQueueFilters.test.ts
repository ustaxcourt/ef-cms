import {
  ROLES,
  PETITIONS_SECTION,
  DOCKET_SECTION,
  CASE_STATUS_TYPES,
  CASE_SERVICES_SUPERVISOR_SECTION,
} from '@shared/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { getWorkQueueFilters } from '@shared/business/utilities/getWorkQueueFilters';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

describe('getWorkQueueFilters', () => {
  const aWorkItem: WorkItemWithCaseInfo = {
    assigneeId: '123',
    docketEntry: {
      isFileAttached: false,
    },
    inProgress: false,
    section: DOCKET_SECTION,
    workItemId: '1',
    createdAt: '2024-11-19T20:40:01.811Z',
    docketNumber: '2049-21',
    sentBy: 'docket clerk',
    updatedAt: '2024-11-20T20:40:01.811Z',
    caseStatus: CASE_STATUS_TYPES.calendared,
  };

  it('returns an object containing a filter map for work queues and boxes', () => {
    const filters = getWorkQueueFilters({
      user: {
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: '123',
        name: 'petitioner person',
      },
    });
    expect(filters).toMatchObject({
      my: {
        inProgress: expect.any(Function),
        inbox: expect.any(Function),
        outbox: expect.any(Function),
      },
      section: {
        inProgress: expect.any(Function),
        inbox: expect.any(Function),
        outbox: expect.any(Function),
      },
    });
  });

  describe('filters for docket clerk', () => {
    let user;
    let workItems;

    beforeAll(() => {
      user = {
        role: ROLES.docketClerk,
        section: DOCKET_SECTION,
        userId: '123',
      };
      workItems = [
        {
          // my in progress
          ...aWorkItem,
          assigneeId: '123',
          docketEntry: {
            isFileAttached: false,
          },
          inProgress: false,
          section: DOCKET_SECTION,
          workItemId: '1',
        },
        {
          // my in progress
          ...aWorkItem,
          assigneeId: '123',
          docketEntry: {},
          inProgress: true,
          section: DOCKET_SECTION,
          workItemId: '2',
        },
        {
          // my inbox
          ...aWorkItem,
          assigneeId: '123',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: DOCKET_SECTION,
          workItemId: '3',
        },
        {
          // my outbox
          ...aWorkItem,
          assigneeId: '123',
          completedAt: '2019-06-17T15:27:55.801Z',
          completedByUserId: '123',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: DOCKET_SECTION,
          workItemId: '4',
        },
        {
          // section in progress
          ...aWorkItem,
          assigneeId: '234',
          docketEntry: {
            isFileAttached: false,
          },
          inProgress: false,
          section: DOCKET_SECTION,
          workItemId: '5',
        },
        {
          // section in progress
          ...aWorkItem,
          assigneeId: '234',
          docketEntry: {},
          inProgress: true,
          section: DOCKET_SECTION,
          workItemId: '6',
        },
        {
          // section inbox
          ...aWorkItem,
          assigneeId: '234',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: DOCKET_SECTION,
          workItemId: '7',
        },
        {
          // section outbox
          ...aWorkItem,
          assigneeId: '234',
          completedAt: '2019-06-17T15:27:55.801Z',
          completedByUserId: '234',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: DOCKET_SECTION,
          workItemId: '8',
        },
      ];
    });

    it('returns an object containing a filter map for work queues and boxes', () => {
      const filters = getWorkQueueFilters({
        user,
      });

      const myInProgress = workItems.filter(filters['my']['inProgress']);
      const myInbox = workItems.filter(filters['my']['inbox']);
      const myOutbox = workItems.filter(filters['my']['outbox']);
      const sectionInProgress = workItems.filter(
        filters['section']['inProgress'],
      );
      const sectionInbox = workItems.filter(filters['section']['inbox']);
      const sectionOutbox = workItems.filter(filters['section']['outbox']);

      expect(myInProgress).toMatchObject([
        expect.objectContaining({ workItemId: '1' }),
        expect.objectContaining({ workItemId: '2' }),
      ]);
      expect(myInbox).toMatchObject([
        expect.objectContaining({ workItemId: '3' }),
      ]);
      expect(myOutbox).toMatchObject([
        expect.objectContaining({ workItemId: '4' }),
      ]);
      expect(sectionInProgress).toMatchObject([
        expect.objectContaining({ workItemId: '1' }),
        expect.objectContaining({ workItemId: '2' }),
        expect.objectContaining({ workItemId: '5' }),
        expect.objectContaining({ workItemId: '6' }),
      ]);
      expect(sectionInbox).toMatchObject([
        expect.objectContaining({ workItemId: '3' }),
        expect.objectContaining({ workItemId: '7' }),
      ]);
      expect(sectionOutbox).toMatchObject([
        expect.objectContaining({ workItemId: '4' }),
        expect.objectContaining({ workItemId: '8' }),
      ]);
    });
  });

  describe('filters for petitions clerk', () => {
    let user: RawUser;
    let workItems;

    beforeAll(() => {
      user = {
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: '123',
        name: 'petitionista',
      };
      workItems = [
        {
          // my in progress
          ...aWorkItem,
          assigneeId: '123',
          caseStatus: CASE_STATUS_TYPES.new,
          docketEntry: {
            isFileAttached: false,
          },
          inProgress: true,
          section: PETITIONS_SECTION,
          workItemId: '1',
        },
        {
          // my in progress
          ...aWorkItem,
          assigneeId: '123',
          caseStatus: CASE_STATUS_TYPES.new,
          docketEntry: {},
          inProgress: true,
          section: PETITIONS_SECTION,
          workItemId: '2',
        },
        {
          // my inbox
          ...aWorkItem,
          assigneeId: '123',
          caseStatus: CASE_STATUS_TYPES.new,
          completedAt: undefined,
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: PETITIONS_SECTION,
          workItemId: '3',
        },
        {
          // my outbox
          ...aWorkItem,
          assigneeId: '123',
          completedAt: '2019-06-17T15:27:55.801Z',
          completedByUserId: '123',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: PETITIONS_SECTION,
          workItemId: '4',
        },
        {
          // section in progress
          ...aWorkItem,
          assigneeId: '234',
          caseStatus: CASE_STATUS_TYPES.new,
          docketEntry: {
            isFileAttached: false,
          },
          inProgress: true,
          section: PETITIONS_SECTION,
          workItemId: '5',
        },
        {
          // section in progress
          ...aWorkItem,
          assigneeId: '234',
          caseStatus: CASE_STATUS_TYPES.new,
          docketEntry: {},
          inProgress: true,
          section: PETITIONS_SECTION,
          workItemId: '6',
        },
        {
          // section inbox
          ...aWorkItem,
          assigneeId: '234',
          caseStatus: CASE_STATUS_TYPES.new,
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: PETITIONS_SECTION,
          workItemId: '7',
        },
        {
          // section outbox
          ...aWorkItem,
          assigneeId: '234',
          completedAt: '2019-06-17T15:27:55.801Z',
          completedByUserId: '234',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: PETITIONS_SECTION,
          workItemId: '8',
        },
        {
          // my in progress
          ...aWorkItem,
          assigneeId: '123',
          caseStatus: CASE_STATUS_TYPES.generalDocket,
          docketEntry: {},
          inProgress: true,
          section: PETITIONS_SECTION,
          workItemId: '9',
        },
      ];
    });

    it('returns an object containing a filter map for work queues and boxes', () => {
      const filters = getWorkQueueFilters({
        user,
      });

      const myInProgress = workItems.filter(filters['my']['inProgress']);
      const myInbox = workItems.filter(filters['my']['inbox']);
      const myOutbox = workItems.filter(filters['my']['outbox']);
      const sectionInProgress = workItems.filter(
        filters['section']['inProgress'],
      );
      const sectionInbox = workItems.filter(filters['section']['inbox']);
      const sectionOutbox = workItems.filter(filters['section']['outbox']);

      expect(myInProgress).toMatchObject([
        expect.objectContaining({ workItemId: '1' }),
        expect.objectContaining({ workItemId: '2' }),
        expect.objectContaining({ workItemId: '9' }),
      ]);
      expect(myInbox).toMatchObject([
        expect.objectContaining({ workItemId: '3' }),
      ]);
      expect(myOutbox).toMatchObject([
        expect.objectContaining({ workItemId: '4' }),
      ]);
      expect(sectionInProgress).toMatchObject([
        expect.objectContaining({ workItemId: '1' }),
        expect.objectContaining({ workItemId: '2' }),
        expect.objectContaining({ workItemId: '5' }),
        expect.objectContaining({ workItemId: '6' }),
        expect.objectContaining({ workItemId: '9' }),
      ]);
      expect(sectionInbox).toMatchObject([
        expect.objectContaining({ workItemId: '3' }),
        expect.objectContaining({ workItemId: '7' }),
      ]);
      expect(sectionOutbox).toMatchObject([
        expect.objectContaining({ workItemId: '4' }),
        expect.objectContaining({ workItemId: '8' }),
      ]);
    });
  });

  describe('filters for case services supervisor', () => {
    let user: RawUser;

    beforeAll(() => {
      user = {
        name: 'case services',
        role: ROLES.caseServicesSupervisor,
        section: CASE_SERVICES_SUPERVISOR_SECTION,
        userId: '123',
      };
    });

    it('returns an object containing a filter map for my work queues and boxes', () => {
      const myWorkItems: WorkItemWithCaseInfo[] = [
        {
          ...aWorkItem,
          // my in progress
          assigneeId: '123',
          docketEntry: {
            isFileAttached: false,
          },
          section: CASE_SERVICES_SUPERVISOR_SECTION,
          workItemId: '1',
        },
        {
          ...aWorkItem,
          // my in progress
          assigneeId: '123',
          caseStatus: CASE_STATUS_TYPES.new,
          inProgress: true,
          docketEntry: {},
          section: CASE_SERVICES_SUPERVISOR_SECTION,
          workItemId: '2',
        },
        {
          ...aWorkItem,
          // my inbox
          assigneeId: '123',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: CASE_SERVICES_SUPERVISOR_SECTION,
          workItemId: '3',
        },
        {
          ...aWorkItem,
          // my outbox
          assigneeId: '123',
          completedAt: '2019-06-17T15:27:55.801Z',
          completedByUserId: '123',
          docketEntry: {
            isFileAttached: true,
          },
          inProgress: false,
          section: CASE_SERVICES_SUPERVISOR_SECTION,
          workItemId: '4',
        },
      ];

      const filters = getWorkQueueFilters({
        user,
      });

      const myInProgress = myWorkItems.filter(filters.my.inProgress);
      const myInbox = myWorkItems.filter(filters.my.inbox);
      const myOutbox = myWorkItems.filter(filters.my.outbox);

      expect(myInProgress).toMatchObject([
        expect.objectContaining({ workItemId: '1' }),
        expect.objectContaining({ workItemId: '2' }),
      ]);
      expect(myInbox).toMatchObject([
        expect.objectContaining({ workItemId: '3' }),
      ]);
      expect(myOutbox).toMatchObject([
        expect.objectContaining({ workItemId: '4' }),
      ]);
    });

    [PETITIONS_SECTION, DOCKET_SECTION].forEach(sectionToTest => {
      it(`returns an object containing a filter map for ${sectionToTest} section work queues and boxes`, () => {
        const sectionWorkItems: WorkItemWithCaseInfo[] = [
          {
            ...aWorkItem,
            // section in progress
            assigneeId: '234',
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              isFileAttached: false,
            },
            section: `${sectionToTest}`,
            workItemId: '5',
            inProgress: true,
          },
          {
            ...aWorkItem,
            // section in progress
            assigneeId: '234',
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {},
            section: `${sectionToTest}`,
            inProgress: true,
            workItemId: '6',
          },
          {
            ...aWorkItem,
            // section inbox
            assigneeId: '234',
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: `${sectionToTest}`,
            workItemId: '7',
          },
          {
            ...aWorkItem,
            // section outbox
            assigneeId: '234',
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: '234',
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: `${sectionToTest}`,
            workItemId: '8',
          },
        ];

        const filters = getWorkQueueFilters({
          section: `${sectionToTest}`,
          user,
        });

        const sectionInProgress = sectionWorkItems.filter(
          filters.section.inProgress,
        );
        const sectionInbox = sectionWorkItems.filter(filters.section.inbox);
        const sectionOutbox = sectionWorkItems.filter(filters.section.outbox);

        expect(sectionInProgress).toMatchObject([
          expect.objectContaining({ workItemId: '5' }),
          expect.objectContaining({ workItemId: '6' }),
        ]);
        expect(sectionInbox).toMatchObject([
          expect.objectContaining({ workItemId: '7' }),
        ]);
        expect(sectionOutbox).toMatchObject([
          expect.objectContaining({ workItemId: '8' }),
        ]);
      });
    });
  });
});
