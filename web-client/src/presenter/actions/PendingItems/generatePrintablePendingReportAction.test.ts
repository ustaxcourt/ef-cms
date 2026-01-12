import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { generatePrintablePendingReportAction } from './generatePrintablePendingReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generatePrintablePendingReportAction', () => {
  const resultUrl = 'https://example.com';
  const TEST_SORT_FIELD = 'TEST_SORT_FIELD';
  const TEST_SORT_ORDER = 'asc';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;

    applicationContextForClient
      .getUseCases()
      .generatePrintablePendingReportInteractor.mockImplementation(
        () => resultUrl,
      );
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });

    const printableCalls = (
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor as jest.Mock
    ).mock.calls;

    expect(printableCalls.length).toEqual(1);
    expect(printableCalls[0][1]).toEqual({});
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail 2', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumberFilter: '123-20',
        sortField: TEST_SORT_FIELD,
        sortOrder: TEST_SORT_ORDER,
      },
      state: {},
    });

    const printableCalls = (
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor as jest.Mock
    ).mock.calls;

    expect(printableCalls.length).toEqual(1);
    expect(printableCalls[0][1]).toEqual({
      docketNumber: '123-20',
    });
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail 3', async () => {
    const TEST_JUDGE = 'Judge Colvin';

    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: {
        judgeFilter: TEST_JUDGE,
        sortField: TEST_SORT_FIELD,
        sortOrder: TEST_SORT_ORDER,
      },
      state: {},
    });

    const printableCalls = (
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor as jest.Mock
    ).mock.calls;

    expect(printableCalls.length).toEqual(1);
    expect(printableCalls[0][1]).toEqual({
      judge: TEST_JUDGE,
      sortField: TEST_SORT_FIELD,
      sortOrder: TEST_SORT_ORDER,
    });
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });
});
