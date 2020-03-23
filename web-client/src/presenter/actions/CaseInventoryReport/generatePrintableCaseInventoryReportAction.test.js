import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableCaseInventoryReportAction } from './generatePrintableCaseInventoryReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generatePrintableCaseInventoryReportAction', () => {
  // let applicationContext;
  // const generatePrintableCaseInventoryReportInteractorMock = jest
  //   .fn()
  //   .mockReturnValue('www.example.com');

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generatePrintableCaseInventoryReportInteractor.mockImplementation(() => {
        console.log('hello?');
        return 'www.example.com';
      });
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

    expect(
      applicationContext.getUseCases()
        .generatePrintableCaseInventoryReportInteractor,
    ).toBeCalledWith({
      applicationContext: expect.anything(),
      associatedJudge: 'Chief Judge',
      status: 'New',
    });
    expect(result.output.pdfUrl).toEqual('www.example.com');
  });
});
