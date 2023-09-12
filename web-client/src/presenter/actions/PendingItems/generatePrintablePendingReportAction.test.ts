import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { generatePrintablePendingReportAction } from './generatePrintablePendingReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generatePrintablePendingReportAction', () => {
  let resultUrl;

  beforeAll(() => {
    resultUrl = 'https://example.com';
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

    expect(
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { docketNumberFilter: '123-20' },
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { judgeFilter: 'Judge Colvin' },
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });
});
