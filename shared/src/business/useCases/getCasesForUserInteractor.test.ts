import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';

describe('getCasesForUserInteractor', () => {
  it('should return the expected associated cases combined with the consolidated group cases for 111-19', async () => {
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
          createdAt: '2019-12-11T16:02:31.173Z',
          docketNumber: '113-19',
          leadDocketNumber: '111-19',
        },
        {
          ...MOCK_CASE,
          createdAt: '2019-08-16T17:29:10.132Z',
          docketNumber: '107-19',
        },
        {
          ...MOCK_CASE,
          createdAt: '2019-03-01T22:53:50.097Z',
          docketNumber: '103-19',
        },
        {
          ...MOCK_CASE,
          closedDate: '2019-03-01T22:53:50.097Z',
          docketNumber: '130-22',
          status: CASE_STATUS_TYPES.closed,
        },
        {
          ...MOCK_CASE,
          closedDate: '2018-03-01T22:53:50.097Z',
          docketNumber: '140-22',
          status: CASE_STATUS_TYPES.closed,
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([
        {
          ...MOCK_CASE,
          createdAt: '2019-12-11T15:25:55.006Z',
          docketNumber: '112-19',
          leadDocketNumber: '111-19',
        },
        {
          ...MOCK_CASE,
          createdAt: '2019-12-11T16:02:31.173Z',
          docketNumber: '113-19',
          leadDocketNumber: '111-19',
        },
        {
          ...MOCK_CASE,
          createdAt: '2019-12-11T15:25:09.284Z',
          docketNumber: '111-19',
          leadDocketNumber: '111-19',
        },
      ]);

    const userCases = await getCasesForUserInteractor(applicationContext);
    expect(userCases).toMatchObject({
      closedCaseList: [
        expect.objectContaining({
          docketNumber: '130-22',
        }),
        expect.objectContaining({
          docketNumber: '140-22',
        }),
      ],
      openCaseList: [
        expect.objectContaining({
          docketNumber: '102-20',
          isRequestingUserAssociated: true,
        }),
        expect.objectContaining({
          consolidatedCases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '112-19',
              isRequestingUserAssociated: false,
            }),
            expect.objectContaining({
              docketNumber: '113-19',
              isRequestingUserAssociated: true,
            }),
          ]),
          docketNumber: '111-19',
          isRequestingUserAssociated: false,
        }),
        expect.objectContaining({
          docketNumber: '107-19',
          isRequestingUserAssociated: true,
        }),
        expect.objectContaining({
          docketNumber: '103-19',
          isRequestingUserAssociated: true,
        }),
      ],
    });
  });

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
