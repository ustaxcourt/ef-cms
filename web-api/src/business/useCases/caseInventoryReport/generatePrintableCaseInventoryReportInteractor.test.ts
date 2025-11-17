import '@web-api/persistence/postgres/cases/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generatePrintableCaseInventoryReportInteractor } from './generatePrintableCaseInventoryReportInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getCaseInventoryReport as getCaseInventoryReportMock } from '@web-api/persistence/postgres/cases/reports/getCaseInventoryReport';

describe('generatePrintableCaseInventoryReportInteractor', () => {
  const getCaseInventoryReport = getCaseInventoryReportMock as jest.Mock;

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .generateCaseInventoryReportPdf.mockReturnValue('https://example.com');

    getCaseInventoryReport.mockReturnValue({
      foundCases: [],
      totalCount: 0,
    });
  });

  it('should call generateCaseInventoryReportPdf function and return result', async () => {
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

  it('should fetch all pages when results span multiple pages', async () => {
    const mockCasesPage1 = Array.from({ length: 100 }, (_, i) => ({
      docketNumber: `${101 + i}-20`,
    }));
    const mockCasesPage2 = Array.from({ length: 50 }, (_, i) => ({
      docketNumber: `${201 + i}-20`,
    }));

    getCaseInventoryReport.mockImplementation(({ page }) => {
      if (page === 0) {
        return { foundCases: mockCasesPage1, totalCount: 150 };
      } else if (page === 1) {
        return { foundCases: mockCasesPage2, totalCount: 150 };
      }
    });

    await generatePrintableCaseInventoryReportInteractor(
      applicationContext,
      {
        associatedJudge: 'Judge Colvin',
      },
      mockPetitionsClerkUser,
    );

    expect(getCaseInventoryReport).toHaveBeenCalledTimes(2);

    expect(getCaseInventoryReport).toHaveBeenCalledWith(
      expect.objectContaining({ page: 0, associatedJudge: 'Judge Colvin' }),
    );
    expect(getCaseInventoryReport).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, associatedJudge: 'Judge Colvin' }),
    );

    expect(
      applicationContext.getUseCaseHelpers().generateCaseInventoryReportPdf,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        cases: expect.arrayContaining([...mockCasesPage1, ...mockCasesPage2]),
      }),
    );
  });

  it('should fetch only one page when all results fit in a single page', async () => {
    const mockCases = Array.from({ length: 50 }, (_, i) => ({
      docketNumber: `${101 + i}-20`,
    }));

    getCaseInventoryReport.mockReturnValue({
      foundCases: mockCases,
      totalCount: 50,
    });

    await generatePrintableCaseInventoryReportInteractor(
      applicationContext,
      {
        status: 'New',
      },
      mockPetitionsClerkUser,
    );

    expect(getCaseInventoryReport).toHaveBeenCalledTimes(1);

    expect(
      applicationContext.getUseCaseHelpers().generateCaseInventoryReportPdf,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        cases: mockCases,
      }),
    );
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
