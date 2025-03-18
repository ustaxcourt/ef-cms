import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
jest.mock('@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines');
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
jest.mock('@web-api/persistence/postgres/cases/getCasesByLeadDocketNumber');
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { removeConsolidatedCasesInteractor } from '@web-api/business/useCases/caseConsolidation/removeConsolidatedCasesInteractor';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCasesByLeadDocketNumber as getCasesByLeadDocketNumberMock } from '@web-api/persistence/postgres/cases/getCasesByLeadDocketNumber';

let mockCases;
let mockLock;

const getCaseDeadlinesByDocketNumber =
  getCaseDeadlinesByDocketNumberMock as jest.Mock;

const upsertCaseDeadlines = upsertCaseDeadlinesMock as jest.Mock;

const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getCasesByLeadDocketNumber = getCasesByLeadDocketNumberMock as jest.Mock;

describe('removeConsolidatedCasesInteractor - Deadlines', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  // afterEach(() => {
  //   jest.resetAllMocks();
  // });

  beforeEach(() => {
    mockLock = undefined;
    mockCases = {
      '101-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '101-19',
        leadDocketNumber: '101-19',
      },
      '102-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '102-19',
        leadDocketNumber: '101-19',
      },
      '103-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '103-19',
        leadDocketNumber: '101-19',
      },
      '104-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '104-19',
        leadDocketNumber: '104-19',
      },
      '105-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '105-19',
        leadDocketNumber: '104-19',
      },
    };

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
      return mockCases[docketNumber];
    });
    getCasesByLeadDocketNumber.mockImplementation(({ leadDocketNumber }) => {
      return Object.keys(mockCases)
        .map(key => mockCases[key])
        .filter(mockCase => mockCase.leadDocketNumber === leadDocketNumber);
    });
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);

    upsertCaseDeadlines.mockImplementation(() => {});
  });

  it('should remove the "consolidatedDeadlineId" from all the associated Deadlines to the CHILD case', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { caseDeadlineId: 2, consolidatedCaseDeadlineId: 1 },
      { caseDeadlineId: 4, consolidatedCaseDeadlineId: 3 },
      { caseDeadlineId: 6, consolidatedCaseDeadlineId: 5 },
    ]);

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '102-19',
        docketNumbersToRemove: ['102-19'],
      },
      mockDocketClerkUser,
    );

    const upsertCaseDeadlinesCalls = upsertCaseDeadlines.mock.calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(1);
    expect(upsertCaseDeadlinesCalls[0][0]).toEqual([
      { caseDeadlineId: 2, consolidatedCaseDeadlineId: undefined },
      { caseDeadlineId: 4, consolidatedCaseDeadlineId: undefined },
      { caseDeadlineId: 6, consolidatedCaseDeadlineId: undefined },
    ]);
  });

  it('should remove the "consolidatedDeadlineId" from all the associated Deadlines to the LEAD case and update all CHILD deadline', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { caseDeadlineId: 2, consolidatedCaseDeadlineId: 1 },
      { caseDeadlineId: 4, consolidatedCaseDeadlineId: 3 },
      { caseDeadlineId: 6, consolidatedCaseDeadlineId: 5 },
    ]);

    let counter = 0;
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockImplementation(() => {
      counter = counter + 1;
      return [
        {
          docketNumber: '102-19',
          caseDeadlineId: `102-19 ${counter}`,
          consolidatedCaseDeadlineId: '101-19',
        },
        {
          docketNumber: '103-19',
          caseDeadlineId: `103-19 ${counter}`,
          consolidatedCaseDeadlineId: '101-19',
        },
        {
          docketNumber: '104-19',
          caseDeadlineId: `104-19 ${counter}`,
          consolidatedCaseDeadlineId: '101-19',
        },
        {
          docketNumber: '105-19',
          caseDeadlineId: `105-19 ${counter}`,
          consolidatedCaseDeadlineId: '101-19',
        },
      ];
    });

    await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        docketNumber: '101-19',
        docketNumbersToRemove: ['101-19'],
      },
      mockDocketClerkUser,
    );

    const upsertCaseDeadlinesCalls = upsertCaseDeadlines.mock.calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(4);
    expect(upsertCaseDeadlinesCalls[0][0]).toEqual([
      {
        caseDeadlineId: '102-19 1',
        consolidatedCaseDeadlineId: undefined,
        docketNumber: '102-19',
      },
      {
        caseDeadlineId: '103-19 1',
        consolidatedCaseDeadlineId: '102-19 1',
        docketNumber: '103-19',
      },
      {
        caseDeadlineId: '104-19 1',
        consolidatedCaseDeadlineId: '102-19 1',
        docketNumber: '104-19',
      },
      {
        caseDeadlineId: '105-19 1',
        consolidatedCaseDeadlineId: '102-19 1',
        docketNumber: '105-19',
      },
    ]);
    expect(upsertCaseDeadlinesCalls[1][0]).toEqual([
      {
        caseDeadlineId: '102-19 2',
        consolidatedCaseDeadlineId: undefined,
        docketNumber: '102-19',
      },
      {
        caseDeadlineId: '103-19 2',
        consolidatedCaseDeadlineId: '102-19 2',
        docketNumber: '103-19',
      },
      {
        caseDeadlineId: '104-19 2',
        consolidatedCaseDeadlineId: '102-19 2',
        docketNumber: '104-19',
      },
      {
        caseDeadlineId: '105-19 2',
        consolidatedCaseDeadlineId: '102-19 2',
        docketNumber: '105-19',
      },
    ]);
    expect(upsertCaseDeadlinesCalls[2][0]).toEqual([
      {
        caseDeadlineId: '102-19 3',
        consolidatedCaseDeadlineId: undefined,
        docketNumber: '102-19',
      },
      {
        caseDeadlineId: '103-19 3',
        consolidatedCaseDeadlineId: '102-19 3',
        docketNumber: '103-19',
      },
      {
        caseDeadlineId: '104-19 3',
        consolidatedCaseDeadlineId: '102-19 3',
        docketNumber: '104-19',
      },
      {
        caseDeadlineId: '105-19 3',
        consolidatedCaseDeadlineId: '102-19 3',
        docketNumber: '105-19',
      },
    ]);
    expect(upsertCaseDeadlinesCalls[3][0]).toEqual([
      { caseDeadlineId: 2, consolidatedCaseDeadlineId: undefined },
      { caseDeadlineId: 4, consolidatedCaseDeadlineId: undefined },
      { caseDeadlineId: 6, consolidatedCaseDeadlineId: undefined },
    ]);
  });
});
