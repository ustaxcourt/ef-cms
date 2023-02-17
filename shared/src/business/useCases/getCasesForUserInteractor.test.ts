import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';

describe('getCasesForUserInteractor', () => {
  const userId = MOCK_CASE.petitioners[0].contactId;
  describe('Consolidated cases', () => {
    let leadCase;
    let memberCase1;
    let memberCase2;
    let consolidatedGroupLeadCase11119: any[];
    let unconsolidatedCase1;
    let unconsolidatedCase2;
    let unconsolidatedCase3;
    let unconsolidatedClosedCase1;
    let unconsolidatedClosedCase2;

    beforeEach(() => {
      leadCase = {
        ...MOCK_CASE,
        createdAt: '2019-12-11T15:25:09.284Z',
        docketNumber: '111-19',
        leadDocketNumber: '111-19',
      };
      memberCase1 = {
        ...MOCK_CASE,
        createdAt: '2019-12-11T15:25:55.006Z',
        docketNumber: '112-19',
        leadDocketNumber: '111-19',
      };
      memberCase2 = {
        ...MOCK_CASE,
        createdAt: '2019-12-11T16:02:31.173Z',
        docketNumber: '113-19',
        leadDocketNumber: '111-19',
      };
      unconsolidatedCase1 = {
        ...MOCK_CASE,
        createdAt: '2020-01-21T16:41:39.474Z',
        docketNumber: '102-20',
      };
      unconsolidatedCase2 = {
        ...MOCK_CASE,
        createdAt: '2019-08-16T17:29:10.132Z',
        docketNumber: '107-19',
      };
      unconsolidatedCase3 = {
        ...MOCK_CASE,
        createdAt: '2019-03-01T22:53:50.097Z',
        docketNumber: '103-19',
      };
      unconsolidatedClosedCase1 = {
        ...MOCK_CASE,
        closedDate: '2019-03-01T22:53:50.097Z',
        docketNumber: '130-22',
        status: CASE_STATUS_TYPES.closed,
      };
      unconsolidatedClosedCase2 = {
        ...MOCK_CASE,
        closedDate: '2018-03-01T22:53:50.097Z',
        docketNumber: '140-22',
        status: CASE_STATUS_TYPES.closed,
      };

      consolidatedGroupLeadCase11119 = [leadCase, memberCase1, memberCase2];
    });

    it('should return the expected associated cases combined with the consolidated group cases for 111-19', async () => {
      memberCase1.petitioners = [];
      leadCase.petitioners = [];

      applicationContext.getCurrentUser.mockResolvedValue({
        userId,
      });
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockResolvedValue([
          unconsolidatedCase1,
          unconsolidatedCase2,
          unconsolidatedCase3,
          unconsolidatedClosedCase1,
          unconsolidatedClosedCase2,
          memberCase2,
        ]);

      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadDocketNumber.mockResolvedValue(
          consolidatedGroupLeadCase11119,
        );

      const userCases = await getCasesForUserInteractor(applicationContext);
      expect(userCases).toMatchObject({
        closedCaseList: [
          expect.objectContaining({
            docketNumber: unconsolidatedClosedCase1.docketNumber,
          }),
          expect.objectContaining({
            docketNumber: unconsolidatedClosedCase2.docketNumber,
          }),
        ],
        openCaseList: [
          expect.objectContaining({
            docketNumber: unconsolidatedCase1.docketNumber,
            isRequestingUserAssociated: true,
          }),
          expect.objectContaining({
            consolidatedCases: expect.arrayContaining([
              expect.objectContaining({
                docketNumber: memberCase1.docketNumber,
                isRequestingUserAssociated: false,
              }),
              expect.objectContaining({
                docketNumber: memberCase2.docketNumber,
                isRequestingUserAssociated: true,
              }),
            ]),
            docketNumber: leadCase.docketNumber,
            isRequestingUserAssociated: false,
          }),
          expect.objectContaining({
            docketNumber: unconsolidatedCase2.docketNumber,
            isRequestingUserAssociated: true,
          }),
          expect.objectContaining({
            docketNumber: unconsolidatedCase3.docketNumber,
            isRequestingUserAssociated: true,
          }),
        ],
      });
    });

    it('should return links to both open and closed consolidated cases when there is a single consolidated group and one case is closed, and one case is open', async () => {
      applicationContext.getCurrentUser.mockResolvedValue({
        userId,
      });
      const consolidatedGroup = [
        {
          ...MOCK_CASE,
          createdAt: '2020-01-21T16:41:39.474Z',
          docketNumber: '102-20',
          leadDocketNumber: '107-19',
        },
        {
          ...MOCK_CASE,
          closedDate: '2019-08-16T17:29:10.132Z',
          createdAt: '2019-08-16T17:29:10.132Z',
          docketNumber: '107-19',
          leadDocketNumber: '107-19',
          status: 'Closed',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockResolvedValue(consolidatedGroup);

      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadDocketNumber.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(applicationContext);

      expect(userCases.openCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-20',
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: '107-19',
          isRequestingUserAssociated: true,
          leadDocketNumber: '107-19',
        }),
      ]);
      expect(userCases.closedCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-20',
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: '107-19',
          isRequestingUserAssociated: true,
          leadDocketNumber: '107-19',
        }),
      ]);
    });

    it('should return closed consolidated cases when there is a single consolidated group and one case is closed (not directly associated), and one case is open (directly associated)', async () => {
      applicationContext.getCurrentUser.mockResolvedValue({
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      });
      const consolidatedGroup = [
        {
          ...MOCK_CASE,
          createdAt: '2020-01-21T16:41:39.474Z',
          docketNumber: '102-20',
          leadDocketNumber: '107-19',
        },
        {
          ...MOCK_CASE,
          closedDate: '2019-08-16T17:29:10.132Z',
          createdAt: '2019-08-16T17:29:10.132Z',
          docketNumber: '107-19',
          leadDocketNumber: '107-19',
          petitioners: [],
          status: 'Closed',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockResolvedValue([consolidatedGroup[0]]);

      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadDocketNumber.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(applicationContext);

      expect(userCases.openCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-20',
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: '107-19',
          isRequestingUserAssociated: false,
          leadDocketNumber: '107-19',
        }),
      ]);
      expect(userCases.closedCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-20',
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: '107-19',
          isRequestingUserAssociated: false,
          leadDocketNumber: '107-19',
        }),
      ]);
    });

    it('should return open consolidated cases when there is a single consolidated group and one case is closed (directly associated), and one case is open (not directly associated)', async () => {
      applicationContext.getCurrentUser.mockResolvedValue({
        userId,
      });
      const consolidatedGroup = [
        {
          ...MOCK_CASE,
          closedDate: '2019-08-16T17:29:10.132Z',
          createdAt: '2020-01-21T16:41:39.474Z',
          docketNumber: '102-20',
          leadDocketNumber: '107-19',
          petitioners: [],
          status: 'Closed',
        },
        {
          ...MOCK_CASE,
          createdAt: '2019-08-16T17:29:10.132Z',
          docketNumber: '107-19',
          leadDocketNumber: '107-19',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockResolvedValue([consolidatedGroup[1]]);

      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadDocketNumber.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(applicationContext);

      expect(userCases.openCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-20',
              isRequestingUserAssociated: false,
            }),
          ]),
          docketNumber: '107-19',
          isRequestingUserAssociated: true,
          leadDocketNumber: '107-19',
        }),
      ]);
      expect(userCases.closedCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '102-20',
              isRequestingUserAssociated: false,
            }),
          ]),
          docketNumber: '107-19',
          isRequestingUserAssociated: true,
          leadDocketNumber: '107-19',
        }),
      ]);
    });

    it('should sort closed cases by most recently closed while closed cases contain a consolidated group where the lead case is not closed', async () => {
      applicationContext.getCurrentUser.mockResolvedValue({
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      });

      const closedDate = '2020-08-16T17:29:10.132Z';
      const consolidatedGroup = [
        {
          ...MOCK_CASE,
          closedDate: 'should not matter',
          docketNumber: '109-19',
          leadDocketNumber: '107-19',
          petitioners: [],
          status: 'Closed',
        },
        {
          ...MOCK_CASE,
          closedDate,
          docketNumber: '108-19',
          leadDocketNumber: '107-19',
          petitioners: [],
          status: 'Closed',
        },
        {
          ...MOCK_CASE,
          docketNumber: '107-19',
          leadDocketNumber: '107-19',
        },
      ];

      const unconsolidatedCases = [
        {
          ...MOCK_CASE,
          closedDate: '2008-08-16T17:29:10.132Z',
          docketNumber: '101-19',
          status: 'Closed',
        },
        {
          ...MOCK_CASE,
          closedDate: '2045-08-16T17:29:10.132Z',
          docketNumber: '200-19',
          status: 'Closed',
        },
      ];

      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockResolvedValue([
          consolidatedGroup[2],
          ...unconsolidatedCases,
        ]);

      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadDocketNumber.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(applicationContext);

      const actualOrder = userCases.closedCaseList.map(
        aCase => aCase.docketNumber,
      );
      const expectedOrder = ['200-19', '107-19', '101-19'];
      expect(actualOrder).toEqual(expectedOrder);
    });
  });

  describe('Non Consolidated Cases', () => {
    it('should return the expected associated cases with NO consolidated groups or lead cases', async () => {
      applicationContext.getCurrentUser.mockResolvedValue({
        userId: '1',
      });
      applicationContext
        .getPersistenceGateway()
        .getCasesForUser.mockResolvedValue([
          {
            ...MOCK_CASE,
            createdAt: '2020-01-21T16:41:39.474Z',
            docketNumber: '102-20',
          },
          {
            ...MOCK_CASE,
            createdAt: '2019-08-16T17:29:10.132Z',
            docketNumber: '107-19',
          },
        ]);

      const userCases = await getCasesForUserInteractor(applicationContext);
      expect(userCases).toMatchObject({
        closedCaseList: [],
        openCaseList: [
          expect.objectContaining({
            docketNumber: '102-20',
            isRequestingUserAssociated: true,
          }),
          expect.objectContaining({
            docketNumber: '107-19',
            isRequestingUserAssociated: true,
          }),
        ],
      });
    });
  });
});
