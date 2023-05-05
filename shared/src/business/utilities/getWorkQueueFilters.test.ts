import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';

import {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} from './getWorkQueueFilters';

describe('getWorkQueueFilters', () => {
  describe('getDocQcSectionForUser', () => {
    it('returns the petitions section if the user is in the petitions section', () => {
      expect(getDocQcSectionForUser({ section: PETITIONS_SECTION })).toEqual(
        PETITIONS_SECTION,
      );
    });

    it('returns the docket section when the user is not in the petitions or case services section', () => {
      expect(getDocQcSectionForUser({ section: DOCKET_SECTION })).toEqual(
        DOCKET_SECTION,
      );
    });
  });

  describe('getWorkQueueFilters', () => {
    it('returns an object containing a filter map for work queues and boxes', () => {
      const filters = getWorkQueueFilters({
        user: {
          role: ROLES.petitionsClerk,
          section: PETITIONS_SECTION,
          userId: '123',
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
            assigneeId: '123',
            docketEntry: {},
            inProgress: true,
            section: DOCKET_SECTION,
            workItemId: '2',
          },
          {
            // my inbox
            assigneeId: '123',
            caseIsInProgress: false,
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: DOCKET_SECTION,
            workItemId: '3',
          },
          {
            // my outbox
            assigneeId: '123',
            caseIsInProgress: false,
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
            assigneeId: '234',
            docketEntry: {},
            inProgress: true,
            section: DOCKET_SECTION,
            workItemId: '6',
          },
          {
            // section inbox
            assigneeId: '234',
            caseIsInProgress: false,
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: DOCKET_SECTION,
            workItemId: '7',
          },
          {
            // section outbox
            assigneeId: '234',
            caseIsInProgress: false,
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
      let user;
      let workItems;

      beforeAll(() => {
        user = {
          role: ROLES.petitionsClerk,
          section: PETITIONS_SECTION,
          userId: '123',
        };
        workItems = [
          {
            // my in progress
            assigneeId: '123',
            caseIsInProgress: true,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              isFileAttached: false,
            },
            section: PETITIONS_SECTION,
            workItemId: '1',
          },
          {
            // my in progress
            assigneeId: '123',
            caseIsInProgress: true,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {},
            section: PETITIONS_SECTION,
            workItemId: '2',
          },
          {
            // my in progress
            assigneeId: '123',
            caseIsInProgress: false,
            caseStatus: CASE_STATUS_TYPES.generalDocket,
            docketEntry: {},
            inProgress: true,
            section: PETITIONS_SECTION,
            workItemId: '9',
          },
          {
            // my inbox
            assigneeId: '123',
            caseIsInProgress: false,
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: PETITIONS_SECTION,
            workItemId: '3',
          },
          {
            // my outbox
            assigneeId: '123',
            caseIsInProgress: false,
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
            assigneeId: '234',
            caseIsInProgress: true,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              isFileAttached: false,
            },
            section: PETITIONS_SECTION,
            workItemId: '5',
          },
          {
            // section in progress
            assigneeId: '234',
            caseIsInProgress: true,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {},
            section: PETITIONS_SECTION,
            workItemId: '6',
          },
          {
            // section inbox
            assigneeId: '234',
            caseIsInProgress: false,
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: PETITIONS_SECTION,
            workItemId: '7',
          },
          {
            // section outbox
            assigneeId: '234',
            caseIsInProgress: false,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: '234',
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: PETITIONS_SECTION,
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
          expect.objectContaining({ workItemId: '9' }),
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

    describe('filters for case services supervisor', () => {
      let user;

      beforeAll(() => {
        user = {
          role: ROLES.caseServicesSupervisor,
          section: CASE_SERVICES_SUPERVISOR_SECTION,
          userId: '123',
        };
      });

      it('returns an object containing a filter map for my work queues and boxes', () => {
        let myWorkItems = [
          {
            // my in progress
            assigneeId: '123',
            docketEntry: {
              isFileAttached: false,
            },
            section: CASE_SERVICES_SUPERVISOR_SECTION,
            workItemId: '1',
          },
          {
            // my in progress
            assigneeId: '123',
            caseIsInProgress: true,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {},
            section: CASE_SERVICES_SUPERVISOR_SECTION,
            workItemId: '2',
          },
          {
            // my inbox
            assigneeId: '123',
            caseIsInProgress: false,
            docketEntry: {
              isFileAttached: true,
            },
            inProgress: false,
            section: CASE_SERVICES_SUPERVISOR_SECTION,
            workItemId: '3',
          },
          {
            // my outbox
            assigneeId: '123',
            caseIsInProgress: false,
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

        const myInProgress = myWorkItems.filter(filters['my']['inProgress']);
        const myInbox = myWorkItems.filter(filters['my']['inbox']);
        const myOutbox = myWorkItems.filter(filters['my']['outbox']);

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
          let sectionWorkItems = [
            {
              // section in progress
              assigneeId: '234',
              caseIsInProgress: true,
              caseStatus: CASE_STATUS_TYPES.new,
              docketEntry: {
                isFileAttached: false,
              },
              section: `${sectionToTest}`,
              workItemId: '5',
            },
            {
              // section in progress
              assigneeId: '234',
              caseIsInProgress: true,
              caseStatus: CASE_STATUS_TYPES.new,
              docketEntry: {},
              section: `${sectionToTest}`,
              workItemId: '6',
            },
            {
              // section inbox
              assigneeId: '234',
              caseIsInProgress: false,
              docketEntry: {
                isFileAttached: true,
              },
              inProgress: false,
              section: `${sectionToTest}`,
              workItemId: '7',
            },
            {
              // section outbox
              assigneeId: '234',
              caseIsInProgress: false,
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
            filters['section']['inProgress'],
          );
          const sectionInbox = sectionWorkItems.filter(
            filters['section']['inbox'],
          );
          const sectionOutbox = sectionWorkItems.filter(
            filters['section']['outbox'],
          );

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
});
