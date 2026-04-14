import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { externalUserCasesHelper as externalUserCasesHelperComputed } from './externalUserCasesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

const externalUserCasesHelper = withAppContextDecorator(
  externalUserCasesHelperComputed,
  {
    ...applicationContext,
    getConstants: () => ({
      CASE_LIST_PAGE_SIZE: 3,
    }),
  },
);

describe('externalUserCasesHelper', () => {
  let baseState;
  beforeEach(() => {
    baseState = {
      closedCases: [
        {
          caseCaption: 'Case Title for 101-20',
          createdAt: '2019-12-22T12:49:10.949Z',
          docketNumber: '101-20',
        },
        {
          caseCaption: 'Case Title for 200-20',
          createdAt: '2019-12-22T12:49:10.949Z',
          docketNumber: '200-20',
        },
        {
          caseCaption: 'Case Title for 103-20',
          consolidatedCases: [
            {
              caseCaption: 'Case Title for 158-20',
              createdAt: '2015-12-22T12:49:10.949Z',
              docketNumber: '158-20',
              isRequestingUserAssociated: true,
              leadDocketNumber: '103-20',
            },
            {
              caseCaption: 'Case Title for 169-20',
              createdAt: '2014-12-22T12:49:10.949Z',
              docketNumber: '169-20',
              isRequestingUserAssociated: true,
              leadDocketNumber: '103-20',
            },
            {
              caseCaption: 'Case Title for 189-20',
              createdAt: '2012-12-22T12:49:10.949Z',
              docketNumber: '189-20',
              isRequestingUserAssociated: true,
              leadDocketNumber: '103-20',
            },
          ],
          docketNumber: '103-20',
        },
        {
          caseCaption: 'Case Title for 104-20',
          createdAt: '2019-12-22T12:49:10.949Z',
          docketNumber: '104-20',
          isRequestingUserAssociated: true,
        },
      ],
      openCases: [
        {
          caseCaption: 'Case Title for 102-20',
          consolidatedCases: [
            {
              caseCaption: 'Case Title for 108-20',
              createdAt: '2019-12-22T12:49:10.949Z',
              docketNumber: '108-20',
              isRequestingUserAssociated: true,
              leadDocketNumber: '102-20',
            },
            {
              caseCaption: 'Case Title for 109-20',
              createdAt: '2017-01-22T12:49:10.949Z',
              docketNumber: '109-20',
              isRequestingUserAssociated: true,
              leadDocketNumber: '102-20',
            },
          ],
          createdAt: '2019-08-22T12:49:10.949Z',
          docketNumber: '102-20',
          isRequestingUserAssociated: false,
          leadDocketNumber: '102-20',
        },
        {
          caseCaption: 'Case Title for 103-21',
          createdAt: '2020-08-22T12:49:10.949Z',
          docketNumber: '103-21',
          isRequestingUserAssociated: true,
        },
        {
          caseCaption: 'Case Title for 103-22',
          createdAt: '2021-08-22T12:49:10.949Z',
          docketNumber: '103-22',
        },
        { createdAt: '2022-08-22T12:49:10.949Z', docketNumber: '103-23' },
      ],
    };
  });

  it('sets the total count of both open and closed cases based on when the user is directly associated with the case', () => {
    const result = runCompute(externalUserCasesHelper, {
      state: baseState,
    });

    expect(result).toMatchObject({
      closedCasesCount: 4,
      openCasesCount: 3,
    });
  });

  it('should format associated open and closed cases', () => {
    const expectedOpenCasesResult = [
      { createdAt: '2022-08-22T12:49:10.949Z', docketNumber: '103-23' },
      {
        caseTitle: 'Case Title for 103-22',
        consolidatedCases: undefined,
        createdAtFormatted: '08/22/21',
        docketNumber: '103-22',
      },
      {
        caseCaption: 'Case Title for 103-21',
        caseTitle: 'Case Title for 103-21',
        consolidatedCases: undefined,
        createdAtFormatted: '08/22/20',
        docketNumber: '103-21',
      },
      {
        caseCaption: 'Case Title for 102-20',
        caseTitle: 'Case Title for 102-20',
        consolidatedCases: [
          {
            caseCaption: 'Case Title for 108-20',
            caseTitle: 'Case Title for 108-20',
            createdAtFormatted: '12/22/19',
            docketNumber: '108-20',
          },
          {
            caseTitle: 'Case Title for 109-20',
            createdAtFormatted: '01/22/17',
            docketNumber: '109-20',
          },
        ],
        createdAtFormatted: '08/22/19',
        docketNumber: '102-20',
      },
    ];

    const expectedClosedCasesResult = [
      {
        caseTitle: 'Case Title for 101-20',
        createdAtFormatted: '12/22/19',
        docketNumber: '101-20',
      },
      {
        caseTitle: 'Case Title for 200-20',
        createdAtFormatted: '12/22/19',
        docketNumber: '200-20',
      },
      {
        caseCaption: 'Case Title for 104-20',
        createdAt: '2019-12-22T12:49:10.949Z',
        docketNumber: '104-20',
        isRequestingUserAssociated: true,
      },
      {
        caseTitle: 'Case Title for 103-20',
        consolidatedCases: [
          {
            caseTitle: 'Case Title for 158-20',
            createdAtFormatted: '12/22/15',
            docketNumber: '158-20',
          },
          {
            caseTitle: 'Case Title for 169-20',
            createdAtFormatted: '12/22/14',
            docketNumber: '169-20',
          },
          {
            caseTitle: 'Case Title for 189-20',
            createdAtFormatted: '12/22/12',
            docketNumber: '189-20',
          },
        ],
        createdAtFormatted: '',
        docketNumber: '103-20',
      },
    ];
    const { closedCaseResults, openCaseResults } = runCompute(
      externalUserCasesHelper,
      {
        state: baseState,
      },
    );

    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(13);

    expect(openCaseResults).toMatchObject(expectedOpenCasesResult);
    expect(closedCaseResults).toMatchObject(expectedClosedCasesResult);
  });

  it('should sort cases by docketNumber', () => {
    baseState.tableSort = {
      sortField: 'docketNumber',
      sortOrder: 'asc',
    };

    const expectedOpenCasesResult = [
      {
        caseCaption: 'Case Title for 102-20',
        caseTitle: 'Case Title for 102-20',
        consolidatedCases: [
          {
            caseCaption: 'Case Title for 108-20',
            caseTitle: 'Case Title for 108-20',
            createdAtFormatted: '12/22/19',
            docketNumber: '108-20',
          },
          {
            caseTitle: 'Case Title for 109-20',
            createdAtFormatted: '01/22/17',
            docketNumber: '109-20',
          },
        ],
        createdAtFormatted: '08/22/19',
        docketNumber: '102-20',
      },
      {
        caseCaption: 'Case Title for 103-21',
        caseTitle: 'Case Title for 103-21',
        consolidatedCases: undefined,
        createdAtFormatted: '08/22/20',
        docketNumber: '103-21',
      },
      {
        caseTitle: 'Case Title for 103-22',
        consolidatedCases: undefined,
        createdAtFormatted: '08/22/21',
        docketNumber: '103-22',
      },
      { createdAt: '2022-08-22T12:49:10.949Z', docketNumber: '103-23' },
    ];

    const expectedClosedCasesResult = [
      {
        caseTitle: 'Case Title for 101-20',
        createdAtFormatted: '12/22/19',
        docketNumber: '101-20',
      },
      {
        caseTitle: 'Case Title for 103-20',
        consolidatedCases: [
          {
            caseTitle: 'Case Title for 158-20',
            createdAtFormatted: '12/22/15',
            docketNumber: '158-20',
          },
          {
            caseTitle: 'Case Title for 169-20',
            createdAtFormatted: '12/22/14',
            docketNumber: '169-20',
          },
          {
            caseTitle: 'Case Title for 189-20',
            createdAtFormatted: '12/22/12',
            docketNumber: '189-20',
          },
        ],
        createdAtFormatted: '',
        docketNumber: '103-20',
      },
      {
        caseCaption: 'Case Title for 104-20',
        createdAt: '2019-12-22T12:49:10.949Z',
        docketNumber: '104-20',
        isRequestingUserAssociated: true,
      },
      {
        caseTitle: 'Case Title for 200-20',
        createdAtFormatted: '12/22/19',
        docketNumber: '200-20',
      },
    ];
    const { closedCaseResults, openCaseResults } = runCompute(
      externalUserCasesHelper,
      {
        state: baseState,
      },
    );

    expect(openCaseResults).toMatchObject(expectedOpenCasesResult);
    expect(closedCaseResults).toMatchObject(expectedClosedCasesResult);
  });
});
