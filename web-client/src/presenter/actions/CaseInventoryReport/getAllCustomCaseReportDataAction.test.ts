import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getAllCustomCaseReportDataAction } from '@web-client/presenter/actions/CaseInventoryReport/getAllCustomCaseReportDataAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getAllCustomCaseReportDataAction', () => {
  let counter = 1;

  beforeEach(() => {
    applicationContext.setTimeout = jest
      .fn()
      .mockImplementation(callback => callback());

    counter = 1;
    applicationContext.getUseCases().getCustomCaseReportInteractor = jest
      .fn()
      .mockImplementation(() => {
        const results = {
          foundCases: [
            {
              highPriority: counter !== 1,
              receivedAt: counter,
              testProp: 'John Cruz' + counter,
            },
          ],
          lastCaseId: { pk: counter.toString(), receivedAt: counter },
        };

        counter = counter + 1;

        return results;
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should fetch all the Custom Case Report data using our interactor and format them', async () => {
    const result = await runAction(getAllCustomCaseReportDataAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseReport: {
          filters: {
            endDate: '12/30/2024',
            judges: ['John The Best Judger to Judge'],
            startDate: '12/30/1960',
            testFilterOne: 'TEST_FILTERS_1',
            testFilterTwo: 'TEST_FILTERS_2',
          },
          totalCases: 9001,
        },
        judges: [
          {
            name: 'John The Best Judger to Judge',
            userId: 1,
          },
        ],
      },
    });

    const getCustomCaseReportInteractorCalls =
      applicationContext.getUseCases().getCustomCaseReportInteractor.mock.calls;

    expect(getCustomCaseReportInteractorCalls.length).toEqual(2);
    expect(getCustomCaseReportInteractorCalls[0][1]).toEqual({
      endDate: '2024-12-31T04:59:59.999Z',
      judges: [1],
      pageSize: 9000,
      searchAfter: { pk: '', receivedAt: 0 },
      startDate: '1960-12-30T05:00:00.000Z',
      testFilterOne: 'TEST_FILTERS_1',
      testFilterTwo: 'TEST_FILTERS_2',
    });

    expect(getCustomCaseReportInteractorCalls[1][1]).toEqual({
      endDate: '2024-12-31T04:59:59.999Z',
      judges: [1],
      pageSize: 9000,
      searchAfter: { pk: '1', receivedAt: 1 },
      startDate: '1960-12-30T05:00:00.000Z',
      testFilterOne: 'TEST_FILTERS_1',
      testFilterTwo: 'TEST_FILTERS_2',
    });

    expect(result.output.formattedCases).toEqual([
      {
        calendaringHighPriority: '',
        highPriority: false,
        receivedAt: 'Invalid DateTime',
        testProp: 'John Cruz1',
      },
      {
        calendaringHighPriority: 'yes',
        highPriority: true,
        receivedAt: 'Invalid DateTime',
        testProp: 'John Cruz2',
      },
    ]);
  });

  it('should throttle when there are 1000000 records', async () => {
    await runAction(getAllCustomCaseReportDataAction, {
      modules: {
        presenter,
      },
      state: {
        customCaseReport: {
          filters: {
            endDate: '12/30/2024',
            judges: ['John The Best Judger to Judge'],
            startDate: '12/30/1960',
            testFilterOne: 'TEST_FILTERS_1',
            testFilterTwo: 'TEST_FILTERS_2',
          },
          totalCases: 1000000,
        },
        judges: [
          {
            name: 'John The Best Judger to Judge',
            userId: 1,
          },
        ],
      },
    });

    const setTimeoutCalls = applicationContext.setTimeout.mock.calls;
    expect(setTimeoutCalls.length).toEqual(11);

    const getCustomCaseReportInteractorCalls =
      applicationContext.getUseCases().getCustomCaseReportInteractor.mock.calls;
    expect(getCustomCaseReportInteractorCalls.length).toEqual(112);
  });

  it('should set batch download totals', async () => {
    const caseTotals = 800;
    applicationContext.getUseCases().getCustomCaseReportInteractor = jest
      .fn()
      .mockImplementation(() => {
        return {
          foundCases: Array.from({ length: caseTotals }, () => ({
            highPriority: counter !== 1,
            receivedAt: counter,
            testProp: 'John Cruz' + counter,
          })),
        };
      });

    const result = await runAction(getAllCustomCaseReportDataAction, {
      modules: {
        presenter,
      },
      state: {
        batchDownloads: {
          fileCount: 0,
          totalFiles: 0,
        },
        customCaseReport: {
          filters: {
            endDate: '12/30/2024',
            judges: ['John The Best Judger to Judge'],
            startDate: '12/30/1960',
            testFilterOne: 'TEST_FILTERS_1',
            testFilterTwo: 'TEST_FILTERS_2',
          },
          totalCases: caseTotals,
        },
        judges: [
          {
            name: 'John The Best Judger to Judge',
            userId: 1,
          },
        ],
      },
    });

    expect(result.state.batchDownloads.fileCount).toEqual(caseTotals);
    expect(result.state.batchDownloads.totalFiles).toEqual(caseTotals);
  });
});
