import { generatePrintableCaseInventoryReportAction } from './generatePrintableCaseInventoryReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generatePrintableCaseInventoryReportAction', () => {
  let applicationContext;
  const generatePrintableCaseInventoryReportInteractorMock = jest
    .fn()
    .mockReturnValue('www.example.com');

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      getUseCases: () => ({
        generatePrintableCaseInventoryReportInteractor: generatePrintableCaseInventoryReportInteractorMock,
      }),
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the use case with params from screenMetadata and return the resulting pdfUrl', async () => {
    const result = await runAction(generatePrintableCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          associatedJudge: 'Chief Judge',
          status: 'New',
        },
      },
    });

    expect(generatePrintableCaseInventoryReportInteractorMock).toBeCalledWith({
      applicationContext: expect.anything(),
      associatedJudge: 'Chief Judge',
      status: 'New',
    });
    expect(result.output.pdfUrl).toEqual('www.example.com');
  });
});
