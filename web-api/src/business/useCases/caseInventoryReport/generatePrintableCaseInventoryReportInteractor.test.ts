import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableCaseInventoryReportInteractor } from './generatePrintableCaseInventoryReportInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('generatePrintableCaseInventoryReportInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .generateCaseInventoryReportPdf.mockReturnValue('https://example.com');
    applicationContext
      .getPersistenceGateway()
      .getCaseInventoryReport.mockReturnValue({ foundCases: [] });
  });

  it('calls generateCaseInventoryReportPdf function and returns result', async () => {
    const results = await generatePrintableCaseInventoryReportInteractor(
      applicationContext,
      {
        associatedJudge: 'Judge Colvin',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().generateCaseInventoryReportPdf,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });

  it('should throw an unauthorized error if the user does not have access', async () => {
    await expect(
      generatePrintableCaseInventoryReportInteractor(
        applicationContext,
        {
          associatedJudge: 'Judge Colvin',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if associatedJudge and status are not passed in', async () => {
    await expect(
      generatePrintableCaseInventoryReportInteractor(
        applicationContext,
        {},
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Either judge or status must be provided');
  });
});
