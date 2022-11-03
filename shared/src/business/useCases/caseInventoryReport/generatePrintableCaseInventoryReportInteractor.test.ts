import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generatePrintableCaseInventoryReportInteractor } from './generatePrintableCaseInventoryReportInteractor';

describe('generatePrintableCaseInventoryReportInteractor', () => {
  it('calls generateCaseInventoryReportPdf function and returns result', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getUseCaseHelpers()
      .generateCaseInventoryReportPdf.mockReturnValue('https://example.com');
    applicationContext
      .getPersistenceGateway()
      .getCaseInventoryReport.mockReturnValue([]);

    const results = await generatePrintableCaseInventoryReportInteractor(
      applicationContext,
      {
        associatedJudge: 'Judge Colvin',
      },
    );

    expect(
      applicationContext.getUseCaseHelpers().generateCaseInventoryReportPdf,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should throw an unauthorized error if the user does not have access', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      generatePrintableCaseInventoryReportInteractor(applicationContext, {
        associatedJudge: 'Judge Colvin',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if associatedJudge and status are not passed in', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      generatePrintableCaseInventoryReportInteractor(applicationContext, {}),
    ).rejects.toThrow('Either judge or status must be provided');
  });
});
