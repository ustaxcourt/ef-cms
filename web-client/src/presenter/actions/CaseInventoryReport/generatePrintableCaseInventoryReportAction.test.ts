import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableCaseInventoryReportAction } from './generatePrintableCaseInventoryReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generatePrintableCaseInventoryReportAction', () => {
  const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .generatePrintableCaseInventoryReportInteractor.mockImplementation(() => {
        return { url: 'www.example.com' };
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
          associatedJudge: CHIEF_JUDGE,
          status: STATUS_TYPES.new,
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .generatePrintableCaseInventoryReportInteractor.mock.calls[0][1],
    ).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      status: STATUS_TYPES.new,
    });
    expect(result.output.pdfUrl).toEqual('www.example.com');
  });
});
