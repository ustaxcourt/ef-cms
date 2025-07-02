import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { cloneDeep } from 'lodash';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';
import { mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { getCasesForUser as getCasesForUserMock } from '@web-api/persistence/postgres/users/cases/getCasesForUser';

describe('getCasesForUserInteractor', () => {
  const getCasesForUser = getCasesForUserMock as jest.Mock;
  const getCasesByDocketNumbers = getCasesByDocketNumbersMock as jest.Mock;
  const getConsolidatedCases = getConsolidatedCasesMock as jest.Mock;
  const mockPetitioner: AuthUser = {
    ...mockPetitionerUser,
    userId: MOCK_CASE.petitioners[0].contactId,
  };
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
    leadCase = cloneDeep({
      ...MOCK_CASE,
      createdAt: '2019-12-11T15:25:09.284Z',
      docketNumber: '111-19',
      leadDocketNumber: '111-19',
    });
    memberCase1 = cloneDeep({
      ...MOCK_CASE,
      createdAt: '2019-12-11T15:25:55.006Z',
      docketNumber: '112-19',
      leadDocketNumber: '111-19',
    });
    memberCase2 = cloneDeep({
      ...MOCK_CASE,
      createdAt: '2019-12-11T16:02:31.173Z',
      docketNumber: '113-19',
      leadDocketNumber: '111-19',
    });
    unconsolidatedCase1 = cloneDeep({
      ...MOCK_CASE,
      createdAt: '2020-01-21T16:41:39.474Z',
      docketNumber: '102-20',
    });
    unconsolidatedCase2 = cloneDeep({
      ...MOCK_CASE,
      createdAt: '2019-08-16T17:29:10.132Z',
      docketNumber: '107-19',
    });
    unconsolidatedCase3 = cloneDeep({
      ...MOCK_CASE,
      createdAt: '2019-03-01T22:53:50.097Z',
      docketNumber: '103-19',
    });
    unconsolidatedClosedCase1 = cloneDeep({
      ...MOCK_CASE,
      closedDate: '2019-03-01T22:53:50.097Z',
      docketNumber: '130-22',
      status: CASE_STATUS_TYPES.closed,
    });
    unconsolidatedClosedCase2 = cloneDeep({
      ...MOCK_CASE,
      closedDate: '2018-03-01T22:53:50.097Z',
      docketNumber: '140-22',
      status: CASE_STATUS_TYPES.closed,
    });

    consolidatedGroupLeadCase11119 = [leadCase, memberCase1, memberCase2];
  });
  describe('Consolidated cases', () => {
    it('should return the expected associated cases combined with the consolidated group cases for 111-19', async () => {
      memberCase1.petitioners = [];
      leadCase.petitioners = [];

      getCasesForUser.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedCase3,
        unconsolidatedClosedCase1,
        unconsolidatedClosedCase2,
        memberCase2,
      ]);

      getCasesByDocketNumbers.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedCase3,
        unconsolidatedClosedCase1,
        unconsolidatedClosedCase2,
        memberCase2,
      ]);

      getConsolidatedCases.mockResolvedValue(consolidatedGroupLeadCase11119);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

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
      const consolidatedGroup = [
        {
          ...leadCase,
          closedDate: '2020-08-16T17:29:10.132Z',
          status: CASE_STATUS_TYPES.closed,
        },
        memberCase1,
      ];

      getCasesForUser.mockResolvedValue(consolidatedGroup);
      getCasesByDocketNumbers.mockResolvedValue(consolidatedGroup);
      getConsolidatedCases.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

      const expectedCaseList = [
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: memberCase1.docketNumber,
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: leadCase.docketNumber,
          isRequestingUserAssociated: true,
          leadDocketNumber: leadCase.leadDocketNumber,
        }),
      ];
      expect(userCases.openCaseList).toEqual(expectedCaseList);
      expect(userCases.closedCaseList).toEqual(expectedCaseList);
    });

    it('should return closed consolidated cases when there is a single consolidated group and one case is closed (not directly associated), and one case is open (directly associated)', async () => {
      const consolidatedGroup = [
        { ...leadCase, petitioners: [], status: CASE_STATUS_TYPES.closed },
        memberCase1,
      ];
      getCasesForUser.mockResolvedValue([memberCase1]);
      getCasesByDocketNumbers.mockResolvedValue([memberCase1]);
      getConsolidatedCases.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

      const expectedCaseList = [
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: memberCase1.docketNumber,
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: leadCase.docketNumber,
          isRequestingUserAssociated: false,
          leadDocketNumber: leadCase.leadDocketNumber,
        }),
      ];
      expect(userCases.openCaseList).toEqual(expectedCaseList);
      expect(userCases.closedCaseList).toEqual(expectedCaseList);
    });

    it('should return open consolidated cases when there is a single consolidated group and one case is closed (directly associated), and one case is open (not directly associated)', async () => {
      const consolidatedGroup = [
        leadCase,
        { ...memberCase1, petitioners: [], status: CASE_STATUS_TYPES.closed },
      ];
      getCasesForUser.mockResolvedValue([leadCase]);
      getCasesByDocketNumbers.mockResolvedValue([leadCase]);
      getConsolidatedCases.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

      const expectedCaseList = [
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: memberCase1.docketNumber,
              isRequestingUserAssociated: false,
            }),
          ]),
          docketNumber: leadCase.docketNumber,
          isRequestingUserAssociated: true,
          leadDocketNumber: leadCase.leadDocketNumber,
        }),
      ];
      expect(userCases.openCaseList).toEqual(expectedCaseList);
      expect(userCases.closedCaseList).toEqual(expectedCaseList);
    });

    it('should sort closed cases by most recently closed when closed cases contain a consolidated group where the lead case is not closed (we use the closed date of the next lowest docket number to sort closed cases when the lead case is open)', async () => {
      const closedDate = '2020-08-16T17:29:10.132Z';
      const consolidatedGroup = [
        leadCase,
        {
          ...memberCase1,
          closedDate,
          petitioners: [],
          status: 'Closed',
        },
        {
          ...memberCase2,
          closedDate: 'should not matter',
          petitioners: [],
          status: 'Closed',
        },
      ];
      const unconsolidatedCases = [
        {
          ...unconsolidatedClosedCase1,
          closedDate: '2008-08-16T17:29:10.132Z',
        },
        {
          ...unconsolidatedClosedCase2,
          closedDate: '2045-08-16T17:29:10.132Z',
        },
      ];
      getCasesForUser.mockResolvedValue([leadCase, ...unconsolidatedCases]);
      getCasesByDocketNumbers.mockResolvedValue([
        leadCase,
        ...unconsolidatedCases,
      ]);
      getConsolidatedCases.mockResolvedValue(consolidatedGroup);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

      const actualOrder = userCases.closedCaseList.map(
        aCase => aCase.docketNumber,
      );
      const expectedOrder = [
        unconsolidatedClosedCase2.docketNumber,
        leadCase.docketNumber,
        unconsolidatedClosedCase1.docketNumber,
      ];
      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should not include docket entries for consolidated cases', async () => {
      memberCase1.petitioners = [];
      leadCase.petitioners = [];

      getCasesForUser.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedCase3,
        unconsolidatedClosedCase1,
        unconsolidatedClosedCase2,
        memberCase2,
      ]);
      getCasesByDocketNumbers.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedCase3,
        unconsolidatedClosedCase1,
        unconsolidatedClosedCase2,
        memberCase2,
      ]);
      getConsolidatedCases.mockResolvedValue(consolidatedGroupLeadCase11119);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

      expect(unconsolidatedCase1.docketEntries).toBeDefined();
      expect(unconsolidatedCase2.docketEntries).toBeDefined();
      expect(unconsolidatedCase3.docketEntries).toBeDefined();
      expect(unconsolidatedClosedCase1.docketEntries).toBeDefined();
      expect(unconsolidatedClosedCase2.docketEntries).toBeDefined();
      expect(memberCase2.docketEntries).toBeDefined();

      ['closedCaseList', 'openCaseList'].forEach(caseGroup => {
        userCases[caseGroup].forEach(userCase => {
          expect(userCase.docketEntries).toBeUndefined();
          expect(userCase.docketNumber).toBeDefined();
        });
      });

      expect(userCases.closedCaseList.length).toBe(2);
      expect(userCases.openCaseList.length).toBe(4);
    });
  });

  describe('Non Consolidated Cases', () => {
    it('should return the expected associated cases with NO consolidated groups or lead cases', async () => {
      getCasesForUser.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedClosedCase1,
      ]);
      getCasesByDocketNumbers.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedClosedCase1,
      ]);

      const userCases = await getCasesForUserInteractor(mockPetitioner);

      expect(userCases.closedCaseList).toEqual([
        expect.objectContaining({
          consolidatedCases: undefined,
          docketNumber: unconsolidatedClosedCase1.docketNumber,
          isRequestingUserAssociated: true,
        }),
      ]);
      expect(userCases.openCaseList).toEqual([
        expect.objectContaining({
          docketNumber: unconsolidatedCase1.docketNumber,
          isRequestingUserAssociated: true,
        }),
        expect.objectContaining({
          docketNumber: unconsolidatedCase2.docketNumber,
          isRequestingUserAssociated: true,
        }),
      ]);
    });

    it('should load cases without throwing exception even if certain case records fail validation', async () => {
      const corruptedCase = {
        someInvalidKey: 'this is an invalid case',
      };

      //construct list of cases w/ at least one bogus/corrupted record
      getCasesForUser.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedClosedCase1,
        corruptedCase,
      ]);
      getCasesByDocketNumbers.mockResolvedValue([
        unconsolidatedCase1,
        unconsolidatedCase2,
        unconsolidatedClosedCase1,
        corruptedCase,
      ]);

      //call validate to ensure that, yes, the case fails validation (todo)
      //call getCasesForUser and expect that no exceptions were thrown
      await expect(
        getCasesForUserInteractor(mockPetitioner),
      ).resolves.not.toThrow();
    });
  });
});
