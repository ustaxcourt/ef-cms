import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintablePendingReportAction } from './generatePrintablePendingReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generatePrintablePendingReportAction', () => {
  let resultUrl;

  beforeAll(() => {
    resultUrl = 'https://example.com';
    presenter.providers.applicationContext = applicationContext;

    applicationContext
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
      applicationContext.getUseCases().generatePrintablePendingReportInteractor,
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
      applicationContext.getUseCases().generatePrintablePendingReportInteractor,
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
      applicationContext.getUseCases().generatePrintablePendingReportInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });
});
