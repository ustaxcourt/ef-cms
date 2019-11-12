import { generatePrintablePendingReportAction } from './generatePrintablePendingReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generatePrintablePendingReportAction', () => {
  let generatePrintablePendingReportInteractorMock;
  const resultUrl = 'https://example.com';

  beforeEach(() => {
    generatePrintablePendingReportInteractorMock = jest.fn(() => resultUrl);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generatePrintablePendingReportInteractor: generatePrintablePendingReportInteractorMock,
      }),
    };
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });

    expect(generatePrintablePendingReportInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { caseIdFilter: '123acb' },
      state: {},
    });

    expect(generatePrintablePendingReportInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });

  it('should call generatePrintablePendingReportInteractor and return caseDetail', async () => {
    const result = await runAction(generatePrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { judgeFilter: 'Judge Armen' },
      state: {},
    });

    expect(generatePrintablePendingReportInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      pdfUrl: resultUrl,
    });
  });
});
